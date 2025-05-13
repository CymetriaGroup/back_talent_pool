import { Router } from "express";
import { CompaniesController } from "../../controllers/companies.controller";
import { container } from "tsyringe";
import { withTryCatch } from "../../../../decorators/withTryCatch";

const router = Router();

const companiesController = container.resolve(CompaniesController);
router.post("/", withTryCatch(companiesController.createCompanies.bind(companiesController)));
router.post("/with-user", withTryCatch(companiesController.createCompaniesWithUser.bind(companiesController)));

export default router;
