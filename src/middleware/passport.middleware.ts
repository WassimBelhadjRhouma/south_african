import * as passport from 'passport';
import { unauthorizedResponse, validationErrorResponse } from "../utils/response.utils";
import { validationResult } from 'express-validator';

export const passportMiddleware = {
    passportSignIn: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        passport.authenticate('local', { session: false },
            (err, user, info) => {
                if (err) {
                    next(err);
                } else if (info) {
                    return unauthorizedResponse(res, { 'msg': info.message });
                } else {
                    req.currentUser = user;
                    next();
                }
            })(req, res, next)
    },
    passportSignInFacebook: (req, res, next) => {
        passport.authenticate('facebook-token', { session: false },
            (err, user, info) => {
                if (err) {
                    if (err.oauthError) {
                        return unauthorizedResponse(res, { 'msg': err.message });
                    } else {
                        next(err);
                    }
                } else if (info) {
                    return unauthorizedResponse(res, { 'msg': info.message });
                } else {
                    req.currentUser = user;
                    next();
                }
            })(req, res, next)
    },
    passportSignInGoogle: (req, res, next) => {
        passport.authenticate('google-token', { session: false },
            (err, user, info) => {
                if (err) {
                    next(err);
                } else if (info) {
                    return unauthorizedResponse(res, { 'msg': info.message });
                } else {
                    req.currentUser = user;
                    next();
                }
            })(req, res, next)
    },
    passportJwtProtect: (req, res, next) => {
        passport.authenticate('jwt', { session: false },
            (err, user, info) => {
                if (err) {
                    next(err);
                } else if (info) {
                    return unauthorizedResponse(res, { 'msg': info.message });
                } else {
                    // let sed = {...req, currentUser: user}
                    // req = sed
                    req.currentUser = user;
                    next();
                }
            })(req, res, next)
    },

}