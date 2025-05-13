import { Companies } from "./companies.entities";
import { Plans } from "./plans.entities";
export class Suscriptions {
	constructor(
		public start_date: Date,
		public end_date: Date,
		public status: string,
		public published_vacancies: number,
		public readonly company_id: string,
		public readonly plan_id: string,
		public readonly plan?: Plans,
		public readonly company?: Companies,
		public readonly id?: string
	) {}
}
// id: UUID (PK)
// company_id: FK → companies
// plan_id: FK → plans
// start_date: Date
// end_date: Date
// published_vacancies: number
// status: ENUM('ACTIVA', 'EXPIRADA', 'CANCELADA')
