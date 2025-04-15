import Joi from "joi";

export const createCompaniesSchema = Joi.object({
	commercial_name: Joi.string().required().messages({
		"string.base": "El nombre comercial debe ser un texto.",
		"any.required": "El nombre comercial es obligatorio.",
		"string.empty": "El nombre comercial no puede estar vacío.",
	}),
	social_reason: Joi.string().required().messages({
		"string.base": "La razón social debe ser un texto.",
		"any.required": "La razón social es obligatoria.",
		"string.empty": "La razón social no puede estar vacía.",
	}),
	nit: Joi.string().required().messages({
		"string.base": "El NIT debe ser un texto.",
		"any.required": "El NIT es obligatorio.",
		"string.empty": "El NIT no puede estar vacío.",
	}),
	sector: Joi.string().required().messages({
		"string.base": "El sector debe ser un texto.",
		"any.required": "El sector es obligatorio.",
		"string.empty": "El sector no puede estar vacío.",
	}),
	country: Joi.string().required().messages({
		"string.base": "El país debe ser un texto.",
		"any.required": "El país es obligatorio.",
		"string.empty": "El país no puede estar vacío.",
	}),
	city: Joi.string().required().messages({
		"string.base": "La ciudad debe ser un texto.",
		"any.required": "La ciudad es obligatoria.",
		"string.empty": "La ciudad no puede estar vacía.",
	}),
	address: Joi.string().required().messages({
		"string.base": "La dirección debe ser un texto.",
		"any.required": "La dirección es obligatoria.",
		"string.empty": "La dirección no puede estar vacía.",
	}),
	phone: Joi.string().required().messages({
		"string.base": "El teléfono debe ser un texto.",
		"any.required": "El teléfono es obligatorio.",
		"string.empty": "El teléfono no puede estar vacío.",
	}),
	number_of_employees: Joi.number().integer().min(1).required().messages({
		"number.base": "El número de empleados debe ser un número.",
		"number.integer": "El número de empleados debe ser un número entero.",
		"number.min": "El número de empleados debe ser al menos 1.",
		"any.required": "El número de empleados es obligatorio.",
	}),
	number_of_annual_vacancies: Joi.number().integer().min(1).required().messages({
		"number.base": "El número de vacantes anuales debe ser un número.",
		"number.integer": "El número de vacantes anuales debe ser un número entero.",
		"number.min": "El número de vacantes anuales debe ser al menos 1.",
		"any.required": "El número de vacantes anuales es obligatorio.",
	}),
})
	.options({ presence: "required" })
	.strict();
