import { injectable, inject } from "tsyringe";
import { HttpException } from "../errors/HttpException";
import { UserCompaniesRepository } from "../../../domain/ports/users.companies.repository";
import { UserCompanies } from "../../../domain/entities/users.companies.entities";
import { UserCompaniesCreateDTO } from "../../../domain/dtos/user_companies/user.companies.dto";
// companies and roles import
import { CompaniesRepository } from "../../../domain/ports/companies.respository";
import { RolesRepository } from "../../../domain/ports/roles.repository";
// security import
import { SecurityService } from "./security/security.service";

@injectable()
export class UserCompaniesService {
	constructor(
		@inject("UserCompaniesRepository")
		private readonly userCompaniesRepository: UserCompaniesRepository,
		@inject("CompaniesRepository")
		private readonly companiesRepository: CompaniesRepository,
		@inject("RolesRepository")
		private readonly rolesRepository: RolesRepository,
		@inject("SecurityService")
		private readonly securityService: SecurityService // Assuming you have a SecurityService for password hashing
	) {}

	async create(user: UserCompaniesCreateDTO): Promise<UserCompanies> {
		const existing = await this.userCompaniesRepository.findByEmail?.(user.email);
		if (existing?.email) {
			throw new HttpException(409, "User with this email already exists");
		}

		// verify company
		const company = await this.companiesRepository.findById?.(user.company_id);
		if (!company) {
			throw new HttpException(404, "Company not found");
		}

		// verify role
		const role = await this.rolesRepository.findById?.(user.id_role);
		if (!role) {
			throw new HttpException(404, "Role not found");
		}
		const hashedPassword = await this.securityService.hashPassword(user.password);
		user.password = hashedPassword;

		return this.userCompaniesRepository.create(user);
	}
	async findByEmail(email: string): Promise<UserCompanies | null> {
		const user = await this.userCompaniesRepository.findByEmail?.(email);
		if (!user) {
			return null;
		}
		return new UserCompanies(
			user.names,
			user.last_names,
			user.email,
			user.phone,
			user.password,
			user.status,
			user.company_id,
			user.id_role,
			user.company,
			user.role
		);
	}
}
