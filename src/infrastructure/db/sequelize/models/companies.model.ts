import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "companies" })
export class CompaniesModel extends Model {
	@Column({ primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4 })
	id!: string;
	@Column(DataType.STRING(100))
	commercial_name!: string;
	@Column(DataType.STRING(100))
	social_reason!: string;
	@Column(DataType.STRING(100))
	nit!: string;
	@Column(DataType.STRING(100))
	sector!: string;
	@Column(DataType.STRING(100))
	country!: string;
	@Column(DataType.STRING(100))
	city!: string;
	@Column(DataType.STRING(100))
	address!: string;
	@Column(DataType.STRING(14))
	phone!: string;
	@Column(DataType.INTEGER())
	number_of_employees!: number;
	@Column(DataType.INTEGER)
	number_of_annual_vacancies!: number;
}
