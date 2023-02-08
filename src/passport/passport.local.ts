// import { IStrategyOptions, LocalStrategy } from 'passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { userService } from '../service/user.service';
import { UserModel } from '../models/user.model';
import { validationResult } from 'express-validator';
import { validationErrorResponse } from '../utils/response.utils';
// import { userService } from "../services/user.service";


const localOptions: IStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
};

export const localLogin = new Strategy(localOptions, (email: string, password: string, done: any) => {
    
    userService.getUser({ email: email.toLowerCase() }, ['password'])
        // .then((user: IUserDocument) => {
        .then((user) => {
            if (!user) {
                return done(null, false, { message: 'Invalid email or password' });
            } else {
                user.comparePassword(password, (err, isMatch) => {
                    if (err) {
                        return done(err);
                    }
                    if (!isMatch) {
                        return done(null, false, { message: 'bad credential' });
                    }
                    return done(null, user);
                });
            }
        })
        .catch((err) => {
            done(err);
        });
});