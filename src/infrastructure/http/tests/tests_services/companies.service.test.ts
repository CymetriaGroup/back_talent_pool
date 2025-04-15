import "reflect-metadata";
import { CompaniesService } from "../../services/companies.service";
import { CompaniesRepository } from "../../../../domain/ports/companies.respository";
import { CreateCompaniesDTO } from "../../../../domain/dtos/companies/companies.dto";
import { Companies } from "../../../../domain/entities/companies.entities";
import { HttpException } from "../../errors/HttpException";

describe("CompaniesService", () => {
	let companiesService: CompaniesService;
	let companiesRepository: jest.Mocked<CompaniesRepository>;

	beforeEach(() => {
		companiesRepository = {
			findById: jest.fn(),
			findByNit: jest.fn(),
			create: jest.fn(),
		} as jest.Mocked<CompaniesRepository>;

		companiesService = new CompaniesService(companiesRepository);
	});

	const validCompany: CreateCompaniesDTO = {
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
	it("should create a new company when NIT does not exist", async () => {
		// Setup
		companiesRepository.findByNit.mockResolvedValue(null);
		companiesRepository.create.mockResolvedValue({ id: "1", ...validCompany } as Companies);

		// Execute
		const result = await companiesService.create(validCompany);

		// Verify
		expect(companiesRepository.findByNit).toHaveBeenCalledWith(validCompany.nit);
		expect(companiesRepository.create).toHaveBeenCalledWith(validCompany);
		expect(result).toEqual({ id: "1", ...validCompany });
	});

	it("should throw HttpException when company with same NIT already exists", async () => {
		// Setup
		companiesRepository.findByNit.mockResolvedValue({ id: "1", ...validCompany } as Companies);

		// Execute & Verify
		await expect(companiesService.create(validCompany)).rejects.toThrow(new HttpException(409, "Company with this NIT already exists"));
		expect(companiesRepository.findByNit).toHaveBeenCalledWith(validCompany.nit);
		expect(companiesRepository.create).not.toHaveBeenCalled();
	});

	it("should handle repository errors during findByNit", async () => {
		// Setup
		const error = new Error("Database connection error");
		companiesRepository.findByNit.mockRejectedValue(error);

		// Execute & Verify
		await expect(companiesService.create(validCompany)).rejects.toThrow(error);
		expect(companiesRepository.findByNit).toHaveBeenCalledWith(validCompany.nit);
		expect(companiesRepository.create).not.toHaveBeenCalled();
	});
});
