export class Companies {
	constructor(
		public commercial_name: string,
		public social_reason: string,
		public nit: string,
		public sector: string,
		public country: string,
		public city: string,
		public address: string,
		public phone: string,
		public number_of_employees: number,
		public number_of_annual_vacancies: number,
		public readonly id?: string
	) {}
}
