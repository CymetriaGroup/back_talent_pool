import { Request, Response } from "express";
import { CompaniesService } from "../services/companies.service";
import { inject, injectable } from "tsyringe";
import { createCompaniesSchema } from "../../../domain/dtos/companies/companies.schema";
import { createCompaniesWithUserSchema } from "../../../domain/dtos/companies/companies-register-with-user.schema";
import { HttpException } from "../errors/HttpException";

@injectable()
export class CompaniesController {
	constructor(
		@inject("CompaniesService")
		private companiesService: CompaniesService
	) {}
	async createCompanies(req: Request, res: Response) {
		const { error, value } = createCompaniesSchema.validate(req.body, {
			abortEarly: false,
		});
		if (error) {
			throw new HttpException(
				400,
				error.details.map((detail) => detail.message)
			);
		}
		const companies = await this.companiesService.create(value);
		return res.status(201).json({ ok: true, companies });
	}
	async createCompaniesWithUser(req: Request, res: Response) {
		const { error, value } = createCompaniesWithUserSchema.validate(req.body, {
			abortEarly: false,
		});
		if (error) {
			throw new HttpException(
				400,
				error.details.map((detail) => detail.message)
			);
		}
		const companies = await this.companiesService.createWithUser(value);
		return res.status(201).json({ ok: true, companies });
	}
}
