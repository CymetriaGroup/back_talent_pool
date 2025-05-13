import { RolesRepository } from "../../../../domain/ports/roles.repository";
import { Roles } from "../../../../domain/entities/roles.entities";
import { RolesModel } from "../models/roles.model";
import { Transaction } from "sequelize";

export class RolesRepositorySequelize implements RolesRepository {
	async findById(id: string): Promise<Roles | null> {
		return RolesModel.findByPk(id).then((role) => {
			if (!role) {
				return null;
			}
			return new Roles(role.name, role.description, role.id);
		});
	}
	async findByName(name: string): Promise<Roles | null> {
		return RolesModel.findOne({ where: { name } }).then((role) => {
			if (!role) {
				return null;
			}
			return new Roles(role.name, role.description, role.id);
		});
	}

	async findAll(options?: { transaction?: Transaction }): Promise<Roles[] | null> {
		return RolesModel.findAll(options).then((roles) => {
			if (!roles) {
				return null;
			}
			return roles.map((role) => new Roles(role.name, role.description, role.id));
		});
	}
}
