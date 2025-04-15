import { Router } from "express";
import { UserCompaniesController } from "../../controllers/user.companies.controller";
import { container } from "tsyringe";
import { withTryCatch } from "../../../../decorators/withTryCatch";

const router = Router();

const userCompaniesController = container.resolve(UserCompaniesController);

router.post("/", withTryCatch(userCompaniesController.createUserCompanies.bind(userCompaniesController)));
router.get("/:email", withTryCatch(userCompaniesController.findByEmail.bind(userCompaniesController)));

export default router;
