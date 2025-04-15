import { container } from "tsyringe";

// inyection for companies repository
import { CompaniesRepository } from "./domain/ports/companies.respository";
import { CompaniesRepositorySequelize } from "./infrastructure/db/sequelize/repositories/companies.repository.sequelize";
import { CompaniesService } from "./infrastructure/http/services/companies.service";
// inyection for users companies repository
import { UserCompaniesRepository } from "./domain/ports/users.companies.repository";
import { UserCompaniesRepositorySequelize } from "./infrastructure/db/sequelize/repositories/user.companies.repository.sequelize";
import { UserCompaniesService } from "./infrastructure/http/services/users.companies.service";
// inyection for roles repository
import { RolesRepository } from "./domain/ports/roles.repository";
import { RolesRepositorySequelize } from "./infrastructure/db/sequelize/repositories/roles.repository.sequelize";
// inyection for security repository
import { SecurityService } from "./infrastructure/http/services/security/security.service";

// inyection for  companies repository
container.register<CompaniesRepository>("CompaniesRepository", {
	useClass: CompaniesRepositorySequelize,
});

container.register<CompaniesService>("CompaniesService", {
	useClass: CompaniesService,
});

// inyection for users companies repository
container.register<UserCompaniesRepository>("UserCompaniesRepository", {
	useClass: UserCompaniesRepositorySequelize,
});
container.register<UserCompaniesService>("UserCompaniesService", {
	useClass: UserCompaniesService,
});

// inyection for roles repository
container.register<RolesRepository>("RolesRepository", {
	useClass: RolesRepositorySequelize,
});

// inyection for security repository
container.register<SecurityService>("SecurityService", {
	useClass: SecurityService,
});
