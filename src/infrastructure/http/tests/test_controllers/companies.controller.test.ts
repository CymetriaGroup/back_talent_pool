import "reflect-metadata";
import { CompaniesController } from "../../controllers/companies.controller";
import { HttpException } from "../../errors/HttpException";
import { Request, Response } from "express";
import { createCompaniesSchema } from "../../../../domain/dtos/companies/companies.schema";
import { createCompaniesWithUserSchema } from "../../../../domain/dtos/companies/companies-register-with-user.schema";
import { CompaniesService } from "../../services/companies.service";
import { SecurityService } from "../../services/security/security.service";
import { UserCompaniesRepository } from "../../../../domain/ports/users.companies.repository";
import { RolesRepository } from "../../../../domain/ports/roles.repository";

// Mock all required dependencies
jest.mock("../../services/companies.service");
jest.mock("../../services/security/security.service");
jest.mock("../../../../domain/dtos/companies/companies.schema", () => ({
	createCompaniesSchema: {
		validate: jest.fn(),
	},
}));
jest.mock("../../../../domain/dtos/companies/companies-register-with-user.schema", () => ({
	createCompaniesWithUserSchema: {
		validate: jest.fn(),
	},
}));

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
	let securityServiceMock: jest.Mocked<SecurityService>;
	let userCompaniesRepositoryMock: jest.Mocked<UserCompaniesRepository>;
	let rolesRepositoryMock: jest.Mocked<RolesRepository>;

	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();

		// Create mock implementations
		const companiesRepositoryMock = {
			findById: jest.fn(),
			findByNit: jest.fn(),
			create: jest.fn(),
		};

		securityServiceMock = {
			hashPassword: jest.fn(),
			comparePassword: jest.fn(),
		} as any;

		userCompaniesRepositoryMock = {
			create: jest.fn(),
			findByEmail: jest.fn(),
		} as any;

		rolesRepositoryMock = {
			findById: jest.fn(),
			findByName: jest.fn(),
			findAll: jest.fn(),
		} as any;

		// Create service with mocked dependencies
		companiesServiceMock = new CompaniesService(
			companiesRepositoryMock as any,
			securityServiceMock,
			userCompaniesRepositoryMock,
			rolesRepositoryMock
		) as jest.Mocked<CompaniesService>;

		// Create controller instance
		controller = new CompaniesController(companiesServiceMock);
	});

	describe("createCompanies", () => {
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

			(createCompaniesSchema.validate as jest.Mock).mockReturnValue({
				error: null,
				value: companyData,
			});

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

			(createCompaniesSchema.validate as jest.Mock).mockReturnValue({
				error: { details: errorDetails },
				value: null,
			});

			try {
				await controller.createCompanies(req, res);
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

			const serviceError = new Error("Database connection failed");
			(companiesServiceMock.create as jest.Mock).mockRejectedValue(serviceError);

			await expect(controller.createCompanies(req, res)).rejects.toThrow(serviceError);
			expect(companiesServiceMock.create).toHaveBeenCalledWith(companyData);
		});

		it("should create company with minimal required data", async () => {
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

	describe("createCompaniesWithUser", () => {
		it("should create company with user and return 201", async () => {
			const companyWithUserData = {
				company: {
					commercial_name: "Tech Corp",
					social_reason: "Tech Corporation S.A.",
					nit: "123456789",
					sector: "Technology",
					country: "Colombia",
					city: "Bogotá",
					address: "123 Tech Street",
					phone: "1234567890",
					number_of_employees: 100,
					number_of_annual_vacancies: 10,
				},
				user: {
					names: "John",
					last_names: "Doe",
					email: "john.doe@example.com",
					phone: "1234567890",
					password: "password123",
					status: "PENDIENTE",
					company_id: "",
					id_role: "",
				},
			};

			const req = mockRequest(companyWithUserData);
			const res = mockResponse();

			(createCompaniesWithUserSchema.validate as jest.Mock).mockReturnValue({
				error: null,
				value: companyWithUserData,
			});

			const responseData = {
				company: { ...companyWithUserData.company, id: "company-123" },
				user: { ...companyWithUserData.user, id: "user-123" },
			};

			(companiesServiceMock.createWithUser as jest.Mock).mockResolvedValue(responseData);

			await controller.createCompaniesWithUser(req, res);

			expect(createCompaniesWithUserSchema.validate).toHaveBeenCalledWith(req.body, { abortEarly: false });
			expect(companiesServiceMock.createWithUser).toHaveBeenCalledWith(companyWithUserData);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ ok: true, companies: responseData });
		});

		it("should handle validation errors for company with user creation", async () => {
			const invalidData = {
				company: {},
				user: {},
			};

			const req = mockRequest(invalidData);
			const res = mockResponse();

			const errorDetails = [{ message: "Company name is required" }, { message: "User email is required" }];

			(createCompaniesWithUserSchema.validate as jest.Mock).mockReturnValue({
				error: { details: errorDetails },
				value: null,
			});

			try {
				await controller.createCompaniesWithUser(req, res);
				fail("Expected HttpException to be thrown");
			} catch (error: any) {
				expect(error).toBeInstanceOf(HttpException);
				expect(error.status).toBe(400);
				expect(error.message).toBe("Company name is required, User email is required");
			}

			expect(companiesServiceMock.createWithUser).not.toHaveBeenCalled();
		});

		it("should handle service errors during company with user creation", async () => {
			const validData = {
				company: {
					commercial_name: "Tech Corp",
					nit: "123456789",
				},
				user: {
					email: "test@example.com",
					password: "password123",
				},
			};

			const req = mockRequest(validData);
			const res = mockResponse();

			(createCompaniesWithUserSchema.validate as jest.Mock).mockReturnValue({
				error: null,
				value: validData,
			});

			const serviceError = new Error("Transaction failed");
			(companiesServiceMock.createWithUser as jest.Mock).mockRejectedValue(serviceError);

			await expect(controller.createCompaniesWithUser(req, res)).rejects.toThrow(serviceError);
			expect(companiesServiceMock.createWithUser).toHaveBeenCalledWith(validData);
		});
	});
});
