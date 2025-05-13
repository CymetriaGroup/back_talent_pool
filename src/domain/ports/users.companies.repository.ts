import { UserCompanies } from "../entities/users.companies.entities";
import { UserCompaniesCreateDTO } from "../dtos/user_companies/user.companies.dto";
import type { Transaction } from "sequelize";

export interface UserCompaniesRepository {
	create(
		user: UserCompaniesCreateDTO,
		options?: {
			transaction?: Transaction;
		}
	): Promise<UserCompanies>;
	findById?(id: string): Promise<UserCompanies | null>;
	findByEmail?(email: string): Promise<UserCompanies | null>;
}
