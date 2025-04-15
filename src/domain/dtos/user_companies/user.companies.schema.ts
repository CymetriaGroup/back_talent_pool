import Joi from "joi";

export const createUserCompaniesSchema = Joi.object({
	names: Joi.string().required().messages({
		"string.base": "El nombre debe ser un texto.",
		"any.required": "El nombre es obligatorio.",
		"string.empty": "El nombre no puede estar vacío.",
	}),
	last_names: Joi.string().required().messages({
		"string.base": "El apellido debe ser un texto.",
		"any.required": "El apellido es obligatorio.",
		"string.empty": "El apellido no puede estar vacío.",
	}),
	email: Joi.string().email().required().messages({
		"string.base": "El correo electrónico debe ser un texto.",
		"any.required": "El correo electrónico es obligatorio.",
		"string.empty": "El correo electrónico no puede estar vacío.",
		"string.email": "El correo electrónico no es válido.",
	}),
	phone: Joi.string().required().messages({
		"string.base": "El teléfono debe ser un texto.",
		"any.required": "El teléfono es obligatorio.",
		"string.empty": "El teléfono no puede estar vacío.",
	}),
	password: Joi.string().required().messages({
		"string.base": "La contraseña debe ser un texto.",
		"any.required": "La contraseña es obligatoria.",
	}),
	status: Joi.string().valid("ACTIVO", "PENDIENTE", "RECHAZADO").required().messages({
		"string.base": "El estado debe ser un texto.",
		"any.required": "El estado es obligatorio.",
		"any.only": 'El estado debe ser uno de los siguientes valores: "ACTIVO", "PENDIENTE", "RECHAZADO".',
		"string.empty": "El estado no puede estar vacío.",
	}),
	company_id: Joi.string().required().messages({
		"string.base": "El ID de la empresa debe ser un texto.",
		"any.required": "El ID de la empresa es obligatorio.",
	}),
	id_role: Joi.string().required().messages({
		"string.base": "El rol debe ser un texto.",
	}),
});
