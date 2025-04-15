import { CompaniesRepository } from "../../../domain/ports/companies.respository";
import { Companies } from "../../../domain/entities/companies.entities";
import { CreateCompaniesDTO } from "../../../domain/dtos/companies/companies.dto";
import { injectable, inject } from "tsyringe";
import { HttpException } from "../errors/HttpException";

@injectable()
export class CompaniesService {
	constructor(
		@inject("CompaniesRepository")
		private readonly companiesRepository: CompaniesRepository
	) {}

	async create(company: CreateCompaniesDTO): Promise<Companies> {
		const existing = await this.companiesRepository.findByNit?.(company.nit);
		if (existing?.nit) {
			throw new HttpException(409, "Company with this NIT already exists");
		}
		return this.companiesRepository.create(company);
	}
}
