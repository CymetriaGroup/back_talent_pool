import Joi from "joi";
import { createCompaniesSchema } from "./companies.schema";
import { createUserCompaniesSchema } from "../user_companies/user.companies.schema";

export const createCompaniesWithUserSchema = Joi.object({
	company: createCompaniesSchema.required(),
	user: createUserCompaniesSchema.required(),
});
