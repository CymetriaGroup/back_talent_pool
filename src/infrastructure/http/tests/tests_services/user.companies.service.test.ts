import "reflect-metadata";
import { UserCompaniesService } from "../../services/users.companies.service";
import { HttpException } from "../../errors/HttpException";
import { UserCompanies } from "../../../../domain/entities/users.companies.entities";
import { UserCompaniesCreateDTO } from "../../../../domain/dtos/user_companies/user.companies.dto";
import { SecurityService } from "../../services/security/security.service";

// Create mocks for dependencies
const mockUserCompaniesRepository = {
	findByEmail: jest.fn(),
	create: jest.fn(),
};

const mockCompaniesRepository = {
	findById: jest.fn(),
};

const mockRolesRepository = {
	findById: jest.fn(),
};

const mockSecurityService = {
	hashPassword: jest.fn(),
	verifyPassword: jest.fn(),
};

describe("UserCompaniesService", () => {
	let service: UserCompaniesService;
	let securityService: SecurityService;

	beforeEach(() => {
		jest.clearAllMocks();
		securityService = mockSecurityService as any;
		service = new UserCompaniesService(
			mockUserCompaniesRepository as any,
			mockCompaniesRepository as any,
			mockRolesRepository as any,
			securityService
		);
	});

	describe("create", () => {
		let userDto: UserCompaniesCreateDTO;

		beforeEach(() => {
			userDto = {
				names: "John",
				last_names: "Doe",
				email: "john.doe@example.com",
				phone: "123456789",
				password: "password",
				status: "PENDIENTE",
				company_id: "1",
				id_role: "1",
			} as UserCompaniesCreateDTO;
		});

		it("should throw an exception if user with email already exists", async () => {
			mockUserCompaniesRepository.findByEmail.mockResolvedValue({
				email: "john.doe@example.com",
			});

			await expect(service.create(userDto)).rejects.toThrow(new HttpException(409, "User with this email already exists"));
			expect(mockUserCompaniesRepository.findByEmail).toHaveBeenCalledWith(userDto.email);
		});

		it("should throw an exception if company not found", async () => {
			mockUserCompaniesRepository.findByEmail.mockResolvedValue(null);
			mockCompaniesRepository.findById.mockResolvedValue(null);

			await expect(service.create(userDto)).rejects.toThrow(new HttpException(404, "Company not found"));
			expect(mockCompaniesRepository.findById).toHaveBeenCalledWith(userDto.company_id);
		});

		it("should throw an exception if role not found", async () => {
			mockUserCompaniesRepository.findByEmail.mockResolvedValue(null);
			mockCompaniesRepository.findById.mockResolvedValue({ id: "1" });
			mockRolesRepository.findById.mockResolvedValue(null);

			await expect(service.create(userDto)).rejects.toThrow(new HttpException(404, "Role not found"));
			expect(mockRolesRepository.findById).toHaveBeenCalledWith(userDto.id_role);
		});

		it("should create a user successfully", async () => {
			const createdUser = { id: "1", ...userDto };
			const hashedPassword = "password"; // Valor simulado para la contraseña hasheada

			// Configuramos los mocks:
			mockUserCompaniesRepository.findByEmail.mockResolvedValue(null);
			mockCompaniesRepository.findById.mockResolvedValue({ id: "1" });
			mockRolesRepository.findById.mockResolvedValue({ id: "1" });
			mockSecurityService.hashPassword.mockResolvedValue(hashedPassword);
			mockUserCompaniesRepository.create.mockResolvedValue(createdUser);

			const result = await service.create(userDto);

			// Verificamos que se llamó a hashPassword una única vez con la contraseña original
			expect(mockSecurityService.hashPassword).toHaveBeenCalledTimes(1);
			expect(mockSecurityService.hashPassword).toHaveBeenCalledWith(userDto.password);

			// Verificamos que se llamó a create del repositorio una única vez con los datos actualizados
			expect(mockUserCompaniesRepository.create).toHaveBeenCalledTimes(1);
			expect(mockUserCompaniesRepository.create).toHaveBeenCalledWith({
				...userDto,
				password: hashedPassword,
			});

			expect(result).toEqual(createdUser);
		});
	});

	describe("findByEmail", () => {
		it("should return null if user not found", async () => {
			mockUserCompaniesRepository.findByEmail.mockResolvedValue(null);

			const result = await service.findByEmail("nonexistent@example.com");

			expect(result).toBeNull();
			expect(mockUserCompaniesRepository.findByEmail).toHaveBeenCalledWith("nonexistent@example.com");
		});

		it("should return user if found", async () => {
			const userData = {
				names: "John",
				last_names: "Doe",
				email: "john.doe@example.com",
				phone: "123456789",
				password: "hashed_password",
				status: true,
				company_id: "1",
				id_role: "1",
				company: { id: "1", name: "Company" },
				role: { id: "1", name: "Role" },
			};

			mockUserCompaniesRepository.findByEmail.mockResolvedValue(userData);

			const result = await service.findByEmail("john.doe@example.com");

			// The service should transform the repository data into a UserCompanies instance
			expect(result).toEqual(expect.any(UserCompanies));
			expect(result?.email).toBe(userData.email);
			expect(mockUserCompaniesRepository.findByEmail).toHaveBeenCalledWith("john.doe@example.com");
		});
	});
});
