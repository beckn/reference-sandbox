import { Request } from "express";
import { Users } from "../db/models/Users.model";

export const createNewUser = async (req: Request) => {
    try {
        const user = await Users.create(req.body);
        return user;
    } catch (error) {
        throw error;
    }
}

export const loginUser = async (req: Request) => {
    try {
        const response = await Users.login(req.body.email, req.body.password);
        return response;
    } catch (error) {
        throw error;
    }
}

export const changePassword = async (user: Users, new_password: string, old_password: string) => {
    try {
        const valid_password = await user.verifyPassword(old_password);
        if (valid_password) {
            user.changePassword(new_password);
            return { status: "success", message: "Password updated" };
        }
        return { status: "error", message: "Old password is incorrect" };
    } catch (error) {
        throw {status:error};
    }
}
