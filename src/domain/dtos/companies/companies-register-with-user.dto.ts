import { CreateCompaniesDTO } from "./companies.dto";
import { UserCompaniesCreateDTO } from "./../user_companies/user.companies.dto";

export class CompaniesRegisterWithUserDTO {
	company!: CreateCompaniesDTO;
	user!: UserCompaniesCreateDTO;
}
