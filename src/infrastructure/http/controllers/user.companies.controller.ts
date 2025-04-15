import { Request, Response } from "express";
import { UserCompaniesService } from "../services/users.companies.service";
import { inject, injectable } from "tsyringe";
import { createUserCompaniesSchema } from "../../../domain/dtos/user_companies/user.companies.schema";
import { HttpException } from "../errors/HttpException";

@injectable()
export class UserCompaniesController {
	constructor(
		@inject("UserCompaniesService")
		private userCompaniesService: UserCompaniesService
	) {}

	async createUserCompanies(req: Request, res: Response) {
		const { error, value } = createUserCompaniesSchema.validate(req.body, {
			abortEarly: false,
		});
		if (error) {
			throw new HttpException(
				400,
				error.details.map((detail) => detail.message)
			);
		}
		const userCompanies = await this.userCompaniesService.create(value);
		return res.status(201).json({ ok: true, userCompanies });
	}
	async findByEmail(req: Request, res: Response) {
		const { email } = req.params;
		const userCompanies = await this.userCompaniesService.findByEmail(email);
		if (!userCompanies) {
			throw new HttpException(404, "User not found");
		}
		return res.status(200).json({ ok: true, userCompanies });
	}
}
