import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { CompaniesModel } from "./companies.model";
import { RolesModel } from "./roles.model";

@Table({ tableName: "user_companies" })
export class UserCompaniesModel extends Model {
	@Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
	id!: string;
	@Column({
		type: DataType.STRING(30),
	})
	names!: string;
	@Column({
		type: DataType.STRING(30),
	})
	last_names!: string;
	@Column({
		type: DataType.STRING(50),
	})
	email!: string;
	@Column({
		type: DataType.STRING(15),
	})
	phone!: string;
	@Column({
		type: DataType.STRING(255),
	})
	password!: string;

	@ForeignKey(() => RolesModel)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	id_role!: string;

	@BelongsTo(() => RolesModel)
	role!: RolesModel;

	@ForeignKey(() => CompaniesModel)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	company_id!: string;

	@BelongsTo(() => CompaniesModel)
	company!: CompaniesModel;

	@Column({
		type: DataType.ENUM("ACTIVO", "PENDIENTE", "RECHAZADO"),
		defaultValue: "PENDIENTE",
		allowNull: false,
	})
	status!: string;
}
