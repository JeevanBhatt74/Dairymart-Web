import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";

const userService = new UserService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            // Validate DTO
            const parsedData = CreateUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({ 
                    success: false, 
                    // Use .format() for structured errors or .issues for the raw array
                    message: parsedData.error.format() 
                });
            }

            const newUser = await userService.createUser(parsedData.data);
            return res.status(201).json({ success: true, message: "User Created", data: newUser });

        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const parsedData = LoginUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({ 
                    success: false, 
                    // Use .format() here as well
                    message: parsedData.error.format() 
                });
            }

            const { token, user } = await userService.loginUser(parsedData.data);
            return res.status(200).json({ success: true, message: "Login successful", token, data: user });

        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
    }
}