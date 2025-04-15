import bcrypt from "bcryptjs";
import { injectable } from "tsyringe";
const SALT_ROUNDS: number = 10;
@injectable()
export class SecurityService {
	async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(SALT_ROUNDS);
		return bcrypt.hash(password, salt);
	}

	async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	}
}
