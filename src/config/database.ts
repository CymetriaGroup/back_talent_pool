import { Sequelize } from "sequelize-typescript";
import { UserModel } from "../infrastructure/db/sequelize/models/user.model";
import { CompaniesModel } from "../infrastructure/db/sequelize/models/companies.model";
import { ENVS_APP, ENVS_DB } from "./envs.config";

export const sequelize = new Sequelize({
	dialect: "mysql",
	host: ENVS_DB.DB_HOST,
	port: Number(ENVS_DB.DB_PORT),
	username: ENVS_DB.DB_USER,
	password: ENVS_DB.DB_PASSWORD,
	database: ENVS_DB.DB_NAME,
	models: [UserModel, CompaniesModel],
	timezone: "-05:00",
	logging: ENVS_APP.IS_PRODUCTION ? console.log : true,
});
