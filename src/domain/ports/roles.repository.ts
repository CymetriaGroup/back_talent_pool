import { Roles } from "../entities/roles.entities";
export interface RolesRepository {
	findById(id: string): Promise<Roles | null>;
	findByName(name: string): Promise<Roles | null>;
}
