export class Plans {
	constructor(
		public name: string,
		public description: string,
		public max_vacancies: number,
		public type_suscription: string,
		public price: number
	) {}
}
