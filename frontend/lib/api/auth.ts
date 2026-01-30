// backend api call only

import axios from "./axios"; // Important: import axios instance
import { API } from "./endpoints";

// user registration api call

export const registerUser = async (registerData: any) => {
    try {
        const response = await axios.post(
            API.AUTH.REGISTER,
            registerData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error
            (err.response?.data?.message
                || err.message
                || "Registration failed"
            );
    }
};

// user login api call

export const loginUser = async (loginData: any) => {
    try {
        const response = await axios.post(
            API.AUTH.LOGIN,
            loginData
        );
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
                || err.message
                || "Login failed"
        );
    }
};
