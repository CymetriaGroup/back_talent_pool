import { CompaniesRepository } from "../../../domain/ports/companies.respository";
import { Companies } from "../../../domain/entities/companies.entities";
import { CreateCompaniesDTO } from "../../../domain/dtos/companies/companies.dto";
import { injectable, inject } from "tsyringe";
import { HttpException } from "../errors/HttpException";
import { SecurityService } from "./security/security.service";
import { CompaniesRegisterWithUserDTO } from "../../../domain/dtos/companies/companies-register-with-user.dto";
import { UserCompaniesRepository } from "../../../domain/ports/users.companies.repository";
import { sequelize } from "../../../config/database";
import { RolesRepository } from "../../../domain/ports/roles.repository";
import { Transaction } from "sequelize";

@injectable()
export class CompaniesService {
	constructor(
		@inject("CompaniesRepository")
		private readonly companiesRepository: CompaniesRepository,
		@inject("SecurityService")
		private readonly securityService: SecurityService,
		@inject("UserCompaniesRepository")
		private readonly userCompaniesRepository: UserCompaniesRepository,
		@inject("RolesRepository")
		private readonly rolesRepository: RolesRepository
	) {}

	async create(company: CreateCompaniesDTO): Promise<Companies> {
		const existing = await this.companiesRepository.findByNit?.(company.nit);
		if (existing?.nit) {
			throw new HttpException(409, "Company with this NIT already exists");
		}
		return this.companiesRepository.create(company);
	}

	async createWithUser(companyWithUser: CompaniesRegisterWithUserDTO): Promise<any> {
		// se verifica si la compañia ya existe
		const existingCompany = await this.companiesRepository.findByNit?.(companyWithUser.company.nit);
		if (existingCompany?.nit) {
			throw new HttpException(409, "Company with this NIT already exists");
		}
		const existingUser = await this.userCompaniesRepository.findByEmail?.(companyWithUser.user.email);
		if (existingUser?.email) {
			throw new HttpException(409, "User with this email already exists");
		}
		const hashedUserPassword = await this.securityService.hashPassword(companyWithUser.user.password);

		return sequelize.transaction(async (tx: Transaction) => {
			const company = await this.companiesRepository.create(companyWithUser.company, { transaction: tx });
			const roles = await this.rolesRepository.findAll({ transaction: tx });
			if (!roles) {
				tx.rollback();
				throw new HttpException(422, "Roles not found");
			}
			if (roles.length === 0) {
				tx.rollback();
				throw new HttpException(422, "No roles found");
			}

			if (!company.id) {
				tx.rollback();
				throw new HttpException(422, "Company ID is missing");
			}

			const roleAdmin = roles.find((role) => role.name.toLowerCase() === "admin");

			if (!roleAdmin?.id) {
				tx.rollback();
				throw new HttpException(422, "Role admin not found");
			}

			const user = await this.userCompaniesRepository.create(
				{
					...companyWithUser.user,
					status: "ACTIVO",
					id_role: roleAdmin.id,
					company_id: company.id,
					password: hashedUserPassword,
				},
				{ transaction: tx }
			);

			if (!user) {
				tx.rollback();
				throw new HttpException(422, "User not created");
			}

			return { company, user };
		});
	}
}
