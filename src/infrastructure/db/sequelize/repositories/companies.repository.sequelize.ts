import { CompaniesRepository } from "../../../../domain/ports/companies.respository";
import { Companies } from "../../../../domain/entities/companies.entities";
import { CompaniesModel } from "../models/companies.model";
import { CreateCompaniesDTO } from "../../../../domain/dtos/companies/companies.dto";

export class CompaniesRepositorySequelize implements CompaniesRepository {
	async create(company: CreateCompaniesDTO): Promise<Companies> {
		const newCompany = await CompaniesModel.create({
			commercial_name: company.commercial_name,
			social_reason: company.social_reason,
			nit: company.nit,
			sector: company.sector,
			country: company.country,
			city: company.city,
			address: company.address,
			phone: company.phone,
			number_of_employees: company.number_of_employees,
			number_of_annual_vacancies: company.number_of_annual_vacancies,
		});
		return new Companies(
			newCompany.commercial_name,
			newCompany.social_reason,
			newCompany.nit,
			newCompany.sector,
			newCompany.country,
			newCompany.city,
			newCompany.address,
			newCompany.phone,
			newCompany.number_of_employees,
			newCompany.number_of_annual_vacancies,
			newCompany.id
		);
	}
	findByNit(nit: string): Promise<Companies | null> {
		return CompaniesModel.findOne({ where: { nit } }).then((company) => {
			if (!company) {
				return null;
			}
			return new Companies(
				company.commercial_name,
				company.social_reason,
				company.nit,
				company.sector,
				company.country,
				company.city,
				company.address,
				company.phone,
				company.number_of_employees,
				company.number_of_annual_vacancies,
				company.id
			);
		});
	}
}
