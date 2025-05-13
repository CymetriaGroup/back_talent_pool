import { Roles } from "../entities/roles.entities";
import type { Transaction } from "sequelize";
export interface RolesRepository {
	findById(id: string): Promise<Roles | null>;
	findByName(name: string): Promise<Roles | null>;
	findAll(options?: { transaction?: Transaction }): Promise<Roles[] | null>;
}
