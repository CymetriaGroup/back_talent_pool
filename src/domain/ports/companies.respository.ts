import { Companies } from "../entities/companies.entities";
import { CreateCompaniesDTO } from "../dtos/companies/companies.dto";
import { CompaniesRegisterWithUserDTO } from "../dtos/companies/companies-register-with-user.dto";
import type { Transaction } from "sequelize";

export interface CompaniesRepository {
	findById(id: string): Promise<Companies | null>;
	findByNit(nit: string): Promise<Companies | null>;
	create(
		company: CreateCompaniesDTO,
		options?: {
			transaction?: Transaction;
		}
	): Promise<Companies>;
	// delete(id: string): Promise<void>;
}
