import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { CompaniesModel } from "./companies.model";
import { PlansModel } from "./plans.model";

@Table({ tableName: "suscriptions" })
export class SuscriptionsModel extends Model {
	@Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
	id!: string;

	@Column({
		type: DataType.DATE,
	})
	start_date!: Date;

	@Column({
		type: DataType.DATE,
	})
	end_date!: Date;

	@Column({
		type: DataType.ENUM("ACTIVA", "EXPIRADA", "CANCELADA"),
		defaultValue: "ACTIVA",
		allowNull: false,
	})
	status!: string;

	@Column({
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	published_vacancies!: number;

	// relations
	@ForeignKey(() => CompaniesModel)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	id_company!: string;

	@BelongsTo(() => CompaniesModel)
	company!: CompaniesModel;

	@ForeignKey(() => PlansModel)
	@Column({
		type: DataType.UUID,
		allowNull: false,
	})
	id_plan!: string;

	@BelongsTo(() => PlansModel)
	plan!: PlansModel;
}
