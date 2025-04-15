import { UserCompanies } from "../entities/users.companies.entities";
import { UserCompaniesCreateDTO } from "../dtos/user_companies/user.companies.dto";

export interface UserCompaniesRepository {
	create(user: UserCompaniesCreateDTO): Promise<UserCompanies>;
	findById?(id: string): Promise<UserCompanies | null>;
	findByEmail?(email: string): Promise<UserCompanies | null>;
}
