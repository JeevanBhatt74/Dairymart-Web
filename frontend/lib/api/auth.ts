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

export const forgotPassword = async (email: string) => {
    try {
        const response = await axios.post(API.AUTH.FORGOT_PASSWORD, { email });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to send OTP"
        );
    }
}

export const verifyOTP = async (email: string, otp: string) => {
    try {
        const response = await axios.post(API.AUTH.VERIFY_OTP, { email, otp });
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to verify OTP"
        );
    }
}

export const resetPassword = async (data: any) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD, data);
        return response.data;
    } catch (err: Error | any) {
        throw new Error(
            err.response?.data?.message
            || err.message
            || "Failed to reset password"
        );
    }
}
