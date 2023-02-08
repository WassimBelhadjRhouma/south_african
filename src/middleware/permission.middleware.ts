import { Role } from "../models/user.model";
import { statusCode } from "../types/statusCode.types";
import { responseMessage } from "../utils/response.utils";

export const checkRole = (roles: Role[]) => {
    return (req, res, next) => {
        if (roles.indexOf(req.currentUser.userType) === -1) {
            return responseMessage(res, statusCode.forbidden, {msg: 'access denied', code:-1});
        }
        next();
    }
}

export const checkLimitation = (req, res, next) => {
    
}