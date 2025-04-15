import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "roles" })
export class RolesModel extends Model {
	@Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
	id!: string;
	@Column({
		type: DataType.STRING(30),
	})
	name!: string;
	@Column({
		type: DataType.STRING(255),
	})
	description!: string;
}
