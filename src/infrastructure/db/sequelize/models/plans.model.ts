import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "plans" })
export class PlansModel extends Model {
	@Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
	id!: string;

	@Column({ type: DataType.STRING })
	name!: string;

	@Column({ type: DataType.TEXT })
	description!: string;

	@Column({ type: DataType.INTEGER })
	max_vacancies!: number;

	@Column({ type: DataType.STRING })
	type_suscription!: string;

	@Column({ type: DataType.DECIMAL(10, 2) })
	price!: number;
}
