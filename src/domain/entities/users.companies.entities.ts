import { Roles } from "./roles.entities";
import { Companies } from "./companies.entities";

export class UserCompanies {
	constructor(
		public names: string,
		public last_names: string,
		public email: string,
		public phone: string,
		public password: string,
		public status: string,
		public readonly company_id: string,
		public readonly id_role: string,
		public readonly company?: Companies,
		public readonly role?: Roles,
		public readonly id?: string
	) {}
}
