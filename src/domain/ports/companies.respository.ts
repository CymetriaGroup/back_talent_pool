import { Companies } from "../entities/companies.entities";
import { CreateCompaniesDTO } from "../dtos/companies/companies.dto";

export interface CompaniesRepository {
	// findById(id: string): Promise<Companies | null>;
	findByNit(nit: string): Promise<Companies | null>;
	create(company: CreateCompaniesDTO): Promise<Companies>;
	// delete(id: string): Promise<void>;
}
