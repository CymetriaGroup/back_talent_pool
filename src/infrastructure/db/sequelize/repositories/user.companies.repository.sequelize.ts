import { UserCompanies } from "../../../../domain/entities/users.companies.entities";
import { UserCompaniesRepository } from "../../../../domain/ports/users.companies.repository";
import { UserCompaniesModel } from "../models/user.companies.model";
import { UserCompaniesCreateDTO } from "../../../../domain/dtos/user_companies/user.companies.dto";
//role and company models
import { CompaniesModel } from "../models/companies.model";
import { RolesModel } from "../models/roles.model";

export class UserCompaniesRepositorySequelize implements UserCompaniesRepository {
	async create(user: UserCompaniesCreateDTO): Promise<UserCompanies> {
		const newUser = await UserCompaniesModel.create({
			names: user.names,
			last_names: user.last_names,
			email: user.email,
			phone: user.phone,
			password: user.password,
			status: user.status,
			company_id: user.company_id,
			id_role: user.id_role,
		});
		return new UserCompanies(
			newUser.names,
			newUser.last_names,
			newUser.email,
			newUser.phone,
			newUser.password,
			newUser.status,
			newUser.company_id,
			newUser.id_role
		);
	}
	async findByEmail(email: string): Promise<UserCompanies | null> {
		const user = await UserCompaniesModel.findOne({
			where: {
				email,
			},
			attributes: {
				exclude: ["password", "company_id", "id_role"],
			},
			include: [
				{
					model: CompaniesModel,
					attributes: ["commercial_name", "nit"],
				},
				{
					model: RolesModel,
					attributes: ["name", "description"],
				},
			],
		});
		if (!user) {
			return null;
		}
		return user;
	}
}
