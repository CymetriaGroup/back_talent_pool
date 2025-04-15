export class HttpException extends Error {
	public readonly status: number;
	public readonly errors?: any; // Detalles opcionales (por ejemplo, validación, inner error, etc.)
	public readonly timestamp: string; // Fecha en que se generó el error
	public readonly code?: string; // Código de error opcional para categorizar el error

	constructor(status: number, message: string | string[], errors?: any, code?: string) {
		// Permitir que el mensaje sea un array y unirlo en una sola cadena
		const msg = Array.isArray(message) ? message.join(", ") : message;
		super(msg);
		// Para asegurar la correcta herencia de Error
		Object.setPrototypeOf(this, HttpException.prototype);

		this.status = status;
		this.errors = errors;
		this.timestamp = new Date().toISOString();
		this.code = code;
	}

	/**
	 * Devuelve una representación JSON estructurada del error,
	 * para ser enviada directamente en la respuesta HTTP.
	 */
	public toJSON() {
		return {
			status: this.status,
			message: this.message,
			timestamp: this.timestamp,
			...(this.code && { code: this.code }),
			...(this.errors && { errors: this.errors }),
		};
	}
}
