type UserStatus = "ACTIVO" | "PENDIENTE" | "RECHAZADO";

export interface UserCompaniesCreateDTO {
	names: string;
	last_names: string;
	email: string;
	phone: string;
	password: string;
	status: UserStatus;
	company_id: string;
	id_role: string;
}
