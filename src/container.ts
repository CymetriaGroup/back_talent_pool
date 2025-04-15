import { container } from "tsyringe";
// injection for user repository
import { UserRepository } from "./domain/ports/UserRepository";
import { UserRepositorySequelize } from "./infrastructure/db/sequelize/repositories/UserRepositorySequelize";
// inyection for companies repository
import { CompaniesRepository } from "./domain/ports/companies.respository";
import { CompaniesRepositorySequelize } from "./infrastructure/db/sequelize/repositories/companies.repository.sequelize";
import { CompaniesService } from "./infrastructure/http/services/companies.service";

container.register<UserRepository>("UserRepository", {
	useClass: UserRepositorySequelize,
});

container.register<CompaniesRepository>("CompaniesRepository", {
	useClass: CompaniesRepositorySequelize,
});

container.register<CompaniesService>("CompaniesService", {
	useClass: CompaniesService,
});
