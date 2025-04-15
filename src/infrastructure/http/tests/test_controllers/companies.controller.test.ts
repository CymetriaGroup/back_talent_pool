import "reflect-metadata";
import { CompaniesController } from "../../controllers/companies.controller";
import { HttpException } from "../../errors/HttpException";
import { Request, Response } from "express";
import { createCompaniesSchema } from "../../../../domain/dtos/companies/companies.schema";
import { CompaniesService } from "../../services/companies.service";

// Se mockea el servicio y el esquema de validación
jest.mock("../../services/companies.service");
jest.mock("../../../../domain/dtos/companies/companies.schema", () => ({
	createCompaniesSchema: {
		validate: jest.fn(),
	},
}));

// Helpers para simular Request y Response de Express
const mockRequest = (body = {}) => ({ body } as Request);
const mockResponse = () => {
	const res: Partial<Response> = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res as Response;
};

describe("CompaniesController", () => {
	let controller: CompaniesController;
	let companiesServiceMock: jest.Mocked<CompaniesService>;

	beforeEach(() => {
		// Creamos un mock básico para el repositorio utilizado en el servicio
		const companiesRepositoryMock = {
			findById: jest.fn(),
			findByNit: jest.fn(),
			create: jest.fn(),
		};

		// Instanciamos el servicio con el repositorio mockeado
		companiesServiceMock = new CompaniesService(companiesRepositoryMock as any) as jest.Mocked<CompaniesService>;
		(companiesServiceMock.create as jest.Mock).mockClear();
		(createCompaniesSchema.validate as jest.Mock).mockClear();

		// Instanciamos el controlador pasando el servicio mockeado
		controller = new CompaniesController(companiesServiceMock);
	});

	it("should create companies and return 201 with companies data", async () => {
		const companyData = {
			name: "Test Company",
			nit: "123456789",
			commercial_name: "Tech Corp",
			social_reason: "Tech Corporation S.A.",
			sector: "Technology",
			country: "Colombia",
			city: "Bogotá",
			address: "123 Tech Street",
			phone: "1234567890",
			number_of_employees: 100,
			number_of_annual_vacancies: 10,
		};

		const req = mockRequest(companyData);
		const res = mockResponse();

		// Simulamos que la validación del esquema es exitosa
		(createCompaniesSchema.validate as jest.Mock).mockReturnValue({
			error: null,
			value: companyData,
		});

		// Simulamos que el servicio retorna la información de la empresa creada (con un id)
		const responseData = { ...companyData, id: "6acdc844-46a6-4af8-8b0a-a888144af4c5" };
		(companiesServiceMock.create as jest.Mock).mockResolvedValue(responseData);

		await controller.createCompanies(req, res);

		expect(createCompaniesSchema.validate).toHaveBeenCalledWith(req.body, { abortEarly: false });
		expect(companiesServiceMock.create).toHaveBeenCalledWith(companyData);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ ok: true, companies: responseData });
	});

	it("should handle multiple validation errors correctly", async () => {
		const req = mockRequest({ name: "", nit: "" });
		const res = mockResponse();
		const errorDetails = [{ message: "Name is required" }, { message: "NIT is required" }];

		// Simulamos múltiples errores de validación
		(createCompaniesSchema.validate as jest.Mock).mockReturnValue({
			error: { details: errorDetails },
			value: null,
		});

		try {
			await controller.createCompanies(req, res);
			// Si no se arroja error, forzamos la falla del test
			fail("Expected HttpException to be thrown");
		} catch (error: any) {
			expect(error).toBeInstanceOf(HttpException);
			expect(error.status).toBe(400);
			expect(error.message).toBe("Name is required, NIT is required");
		}
	});

	it("should call schema.validate with abortEarly false", async () => {
		const req = mockRequest({ name: "Another Company" });
		const res = mockResponse();

		// Simulamos validación exitosa
		(createCompaniesSchema.validate as jest.Mock).mockReturnValue({
			error: null,
			value: req.body,
		});

		(companiesServiceMock.create as jest.Mock).mockResolvedValue({ id: 2, ...req.body });

		await controller.createCompanies(req, res);

		expect(createCompaniesSchema.validate).toHaveBeenCalledWith(req.body, { abortEarly: false });
	});

	it("should handle service errors and propagate them", async () => {
		const companyData = {
			name: "Valid Company",
			nit: "12345678",
		};
		const req = mockRequest(companyData);
		const res = mockResponse();

		(createCompaniesSchema.validate as jest.Mock).mockReturnValue({
			error: null,
			value: companyData,
		});

		// Simulamos un error en el servicio (por ejemplo, fallo en la base de datos)
		const serviceError = new Error("Database connection failed");
		(companiesServiceMock.create as jest.Mock).mockRejectedValue(serviceError);

		await expect(controller.createCompanies(req, res)).rejects.toThrow(serviceError);
		expect(companiesServiceMock.create).toHaveBeenCalledWith(companyData);
	});

	it("should create company with minimal required data", async () => {
		// En este caso, asumimos que estos son los campos mínimos requeridos (según lo que retorna la validación mockeada)
		const minimalCompanyData = {
			name: "Minimal Company",
			nit: "987654321",
		};

		const req = mockRequest(minimalCompanyData);
		const res = mockResponse();

		(createCompaniesSchema.validate as jest.Mock).mockReturnValue({
			error: null,
			value: minimalCompanyData,
		});

		const responseData = { ...minimalCompanyData, id: "minimal-id-123" };
		(companiesServiceMock.create as jest.Mock).mockResolvedValue(responseData);

		await controller.createCompanies(req, res);

		expect(companiesServiceMock.create).toHaveBeenCalledWith(minimalCompanyData);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ ok: true, companies: responseData });
	});
});
