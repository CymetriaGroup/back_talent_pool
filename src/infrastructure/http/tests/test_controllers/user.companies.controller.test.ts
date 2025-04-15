import "reflect-metadata";
import { UserCompaniesController } from "../../controllers/user.companies.controller";
import { UserCompaniesService } from "../../services/users.companies.service";
import * as schema from "../../../../domain/dtos/user_companies/user.companies.schema";
import { HttpException } from "../../errors/HttpException";
import { Request, Response } from "express";

jest.mock("../../../../domain/dtos/user_companies/user.companies.schema", () => ({
	createUserCompaniesSchema: {
		validate: jest.fn(),
	},
}));

describe("UserCompaniesController", () => {
	let controller: UserCompaniesController;
	let userCompaniesService: UserCompaniesService;
	let req: Partial<Request>;
	let res: Partial<Response>;

	beforeEach(() => {
		userCompaniesService = {
			create: jest.fn(),
			findByEmail: jest.fn(),
		} as unknown as UserCompaniesService;

		controller = new UserCompaniesController(userCompaniesService);

		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		jest.clearAllMocks();
	});

	describe("createUserCompanies", () => {
		it("should create user companies successfully", async () => {
			const mockUserCompaniesData = { userId: "123", companies: ["company1", "company2"] };
			req.body = mockUserCompaniesData;

			(schema.createUserCompaniesSchema.validate as jest.Mock).mockReturnValue({
				error: null,
				value: mockUserCompaniesData,
			});

			(userCompaniesService.create as jest.Mock).mockResolvedValue(mockUserCompaniesData);

			await controller.createUserCompanies(req as Request, res as Response);

			expect(schema.createUserCompaniesSchema.validate).toHaveBeenCalledWith(req.body, { abortEarly: false });
			expect(userCompaniesService.create).toHaveBeenCalledWith(mockUserCompaniesData);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ ok: true, userCompanies: mockUserCompaniesData });
		});

		it("should throw HttpException when validation fails", async () => {
			const mockError = {
				details: [{ message: "userId is required" }, { message: "companies should be an array" }],
			};

			req.body = {};

			(schema.createUserCompaniesSchema.validate as jest.Mock).mockReturnValue({
				error: mockError,
				value: null,
			});

			await expect(controller.createUserCompanies(req as Request, res as Response)).rejects.toThrow(HttpException);

			expect(schema.createUserCompaniesSchema.validate).toHaveBeenCalledWith(req.body, { abortEarly: false });
			expect(userCompaniesService.create).not.toHaveBeenCalled();
		});

		it("should include all error messages when multiple validation errors occur", async () => {
			const mockError = {
				details: [{ message: "userId is required" }, { message: "companies should be an array" }, { message: "email format is invalid" }],
			};

			req.body = { userId: "", companies: "not-an-array" };

			(schema.createUserCompaniesSchema.validate as jest.Mock).mockReturnValue({
				error: mockError,
				value: null,
			});

			try {
				await controller.createUserCompanies(req as Request, res as Response);
				fail("Should have thrown an error");
			} catch (error) {
				expect(error).toBeInstanceOf(HttpException);
				expect((error as HttpException).status).toBe(400);
				expect((error as HttpException).message).toEqual(
					["userId is required", " companies should be an array", " email format is invalid"].toString()
				);
			}
		});

		it("should handle service errors during creation", async () => {
			const mockUserCompaniesData = { userId: "123", companies: ["company1"] };
			req.body = mockUserCompaniesData;

			(schema.createUserCompaniesSchema.validate as jest.Mock).mockReturnValue({
				error: null,
				value: mockUserCompaniesData,
			});

			const serviceError = new Error("Database connection error");
			(userCompaniesService.create as jest.Mock).mockRejectedValue(serviceError);

			await expect(controller.createUserCompanies(req as Request, res as Response)).rejects.toThrow(serviceError);
			expect(userCompaniesService.create).toHaveBeenCalledWith(mockUserCompaniesData);
		});

		it("should create user companies with minimal valid data", async () => {
			const mockUserCompaniesData = { userId: "123", companies: [] };
			req.body = mockUserCompaniesData;

			(schema.createUserCompaniesSchema.validate as jest.Mock).mockReturnValue({
				error: null,
				value: mockUserCompaniesData,
			});

			(userCompaniesService.create as jest.Mock).mockResolvedValue(mockUserCompaniesData);

			await controller.createUserCompanies(req as Request, res as Response);

			expect(userCompaniesService.create).toHaveBeenCalledWith(mockUserCompaniesData);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ ok: true, userCompanies: mockUserCompaniesData });
		});
	});

	describe("findByEmail", () => {
		it("should find user companies by email successfully", async () => {
			const email = "test@example.com";
			const mockUserCompanies = { userId: "123", companies: ["company1", "company2"] };

			req.params = { email };
			(userCompaniesService.findByEmail as jest.Mock).mockResolvedValue(mockUserCompanies);

			await controller.findByEmail(req as Request, res as Response);

			expect(userCompaniesService.findByEmail).toHaveBeenCalledWith(email);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ ok: true, userCompanies: mockUserCompanies });
		});

		it("should throw HttpException when user not found", async () => {
			const email = "nonexistent@example.com";

			req.params = { email };
			(userCompaniesService.findByEmail as jest.Mock).mockResolvedValue(null);

			await expect(controller.findByEmail(req as Request, res as Response)).rejects.toThrow(new HttpException(404, "User not found"));

			expect(userCompaniesService.findByEmail).toHaveBeenCalledWith(email);
		});

		it("should find user companies with complex email format", async () => {
			const email = "test.user+tag123@example-domain.co.uk";
			const mockUserCompanies = { userId: "456", companies: ["company3"] };

			req.params = { email };
			(userCompaniesService.findByEmail as jest.Mock).mockResolvedValue(mockUserCompanies);

			await controller.findByEmail(req as Request, res as Response);

			expect(userCompaniesService.findByEmail).toHaveBeenCalledWith(email);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ ok: true, userCompanies: mockUserCompanies });
		});

		it("should handle service errors during findByEmail", async () => {
			const email = "test@example.com";
			req.params = { email };

			const serviceError = new Error("Database query failed");
			(userCompaniesService.findByEmail as jest.Mock).mockRejectedValue(serviceError);

			await expect(controller.findByEmail(req as Request, res as Response)).rejects.toThrow(serviceError);
			expect(userCompaniesService.findByEmail).toHaveBeenCalledWith(email);
		});

		it("should throw HttpException with correct message when user not found", async () => {
			const email = "missing@example.com";
			req.params = { email };

			(userCompaniesService.findByEmail as jest.Mock).mockResolvedValue(null);

			try {
				await controller.findByEmail(req as Request, res as Response);
				fail("Should have thrown an error");
			} catch (error) {
				expect(error).toBeInstanceOf(HttpException);
				expect((error as HttpException).status).toBe(404);
				expect((error as HttpException).message).toBe("User not found");
			}
		});

		it("should handle empty email parameter", async () => {
			const email = "";
			req.params = { email };

			(userCompaniesService.findByEmail as jest.Mock).mockResolvedValue(null);

			await expect(controller.findByEmail(req as Request, res as Response)).rejects.toThrow(HttpException);
			expect(userCompaniesService.findByEmail).toHaveBeenCalledWith("");
		});

		it("should find user with no companies", async () => {
			const email = "nocompanies@example.com";
			const mockUserCompanies = { userId: "789", companies: [] };

			req.params = { email };
			(userCompaniesService.findByEmail as jest.Mock).mockResolvedValue(mockUserCompanies);

			await controller.findByEmail(req as Request, res as Response);

			expect(userCompaniesService.findByEmail).toHaveBeenCalledWith(email);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ ok: true, userCompanies: mockUserCompanies });
		});

		it("should handle case-insensitive email lookup", async () => {
			// This test verifies the controller passes the email as-is to the service
			const mixedCaseEmail = "MixedCase@Example.com";
			const mockUserCompanies = { userId: "101", companies: ["company1"] };

			req.params = { email: mixedCaseEmail };
			(userCompaniesService.findByEmail as jest.Mock).mockResolvedValue(mockUserCompanies);

			await controller.findByEmail(req as Request, res as Response);

			expect(userCompaniesService.findByEmail).toHaveBeenCalledWith(mixedCaseEmail);
			expect(res.status).toHaveBeenCalledWith(200);
		});
	});
});
