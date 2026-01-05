import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const userRepository = new UserRepository();

export class UserService {
    async createUser(data: CreateUserDTO) {
        // 1. Check unique email/username
        const emailCheck = await userRepository.getUserByEmail(data.email);
        if (emailCheck) throw new HttpError(403, "Email already in use");
        
        const usernameCheck = await userRepository.getUserByUsername(data.username);
        if (usernameCheck) throw new HttpError(403, "Username already in use");

        // 2. Hash Password
        const hashedPassword = await bcryptjs.hash(data.password, 10);
        
        // 3. Save User (exclude confirmPassword from being saved)
        const { confirmPassword, ...userToSave } = data;
        const newUser = await userRepository.createUser({ ...userToSave, password: hashedPassword });
        
        return newUser;
    }

    async loginUser(data: LoginUserDTO) {
        // 1. Check User exists
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) throw new HttpError(404, "User not found");

        // 2. Check Password
        const validPassword = await bcryptjs.compare(data.password, user.password!);
        if (!validPassword) throw new HttpError(401, "Invalid credentials");

        // 3. Generate Token
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

        return { token, user };
    }
}