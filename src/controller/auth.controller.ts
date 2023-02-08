// import { IverifedToken, User } from "../models/user.model"
// import { successResponse, validationErrorResponse } from '../utils/response.utils';
import { Request, Response, NextFunction } from 'express'
import { userService } from '../service/user.service';

// import { resolve } from 'path';

import { validationResult } from "express-validator";
import { responseMessage, successResponse, validationErrorResponse } from '../utils/response.utils';
import { statusCode } from '../types/statusCode.types';
import { IUser, IverifedToken } from '../types/user.type';
import { User } from '../models/user.model';
  
// import { userService } from "../services/user.service";
// import { mailer } from "./../utils/mailer.utils";
// import { userRessource } from "../ressources/user.ressource";

export const authController = {

    emailSignup: async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // validationErrorResponse
            return responseMessage(res, statusCode.ClientErrorBadRequest ,errors.array()[0].msg);
        }
        userService.checkExistance({ email: req.body.email })
        // userService.getUser({ email: req.body.email }, ['codeValidation', 'emailConfirmed', 'isBlocked'])
        .then((exist) => {
                if (exist) {
                    // when there is existance for the user
                    // the result's value should be  the _id of the model in the database
                    // if(user.codeValidation.)
                    // return successResponse(res, { code: -1, msg: 'email already exist' });
                    return responseMessage(res, statusCode.SuccessOK, { code: -1, msg: 'email already exist' });
                    
                }
        // this means the result value is NULL
                else{
                    // const newUser: IUser = req.body;
                    const newUser: IUser = req.body
                    newUser.email = newUser.email.toLowerCase().trim();
                    newUser.codeValidation = User.generateCode(req.body.email)
                    userService.addUser(newUser)
                        .then(() => {
                            // mailer.welcomeEmail(newUser.email, newUser.codeValidation);
                            return responseMessage(res, statusCode.SuccessOK , { code: 1, msg: 'user created' });
                        })
                        .catch((err) => {
                            next(err);
                        });
                }                    
            })
            .catch((err) => {
                next(err);
            });
            

    },

    signin: async (req, res: Response, next: NextFunction) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return validationErrorResponse(res, errors.array()[0].msg);
            return responseMessage(res, statusCode.ClientErrorBadRequest ,errors.array()[0].msg);
        }
        const user = req.currentUser;
        if (user.isBlocked) {
            // return successResponse(res, { code: -2, msg: 'blocked user' });
            return responseMessage(res, statusCode.SuccessOK , {code: -2, msg: 'blocked user'});

        } 
        // else if (!user.emailConfirmed) {

        //     return successResponse(res, { code: -1, msg: 'please confirm your email' });
        //     // And ask him if he needs to resend a confirmation code. 
        //     // he also has the option to reset his passwird and in this case we will send him a code in his email 
        //     // and when he do it we do both, we activate his account and we create a new password to him.
        // } 
        // else if (!user.password || !user.region || !user.city) {
        // else if (!user.password) {
        //     // return successResponse(res, { code: 2, msg: 'please update your profile', user: userRessource.profile(user), "token": user.generateJwt() });
        //     return successResponse(res, { code: 2, msg: 'please update your profile', user: {papa: 'dsdss'}, "token": 'dfffdfdfd' });
        // } else {
            // return successResponse(res, { code: 1, user: userRessource.profile(user), "token": user.generateJwt() });
            // Lahne in case bsh nredirectih l blassa, l 7assilou l blassa adhyka dub mayaamel sign in, ken bech yest7a9 
            // feha ma3loumet tefha mafamech alech bech nkhalih yrajaa token kahaw, instead khalih yrajaa zeda l hajet li
            // bech nestaaamelhom fel blassa elli bech ysir feha redirect
            return responseMessage(res, statusCode.SuccessOK , { code: 1, "token": user.generateJwt()});

        // }
    },
    emailConfirmation: async (req: any, res, next) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseMessage(res, statusCode.ClientErrorBadRequest ,errors.array()[0].msg);
        }

        const tokenStatus: IverifedToken = User.checkGeneratedCode(req.query.emailCode)

        if (tokenStatus.status === 'invalid') {
            return responseMessage(res, statusCode.SuccessOK , { code: -1, msg: 'invalid confirmation code' });
        } 
        else if (tokenStatus.status === 'expired') { // resend
            
            return responseMessage(res, statusCode.SuccessOK , { code: -1, msg: 'expired token' });
            // in this case, this will be opened in the client side. 
            // we will give him the option to send a new confirmation code ;)
            // in this case the code written in the bottom will not be considered i our application. 
            // const codeValidation = generateCode(tokenStatus.email);
            // userService.updateUser({ email: tokenStatus.email, emailConfirmed: false, codeValidation: req.query.emailCode }, { codeValidation })
            //     .then((user) => {
            //         if (!user) {
            //             return successResponse(res, { code: -1, msg: 'invalid confirmation code' });
            //         } else {
            //             // mailer.welcomeEmail(tokenStatus.email, codeValidation);
            //             return successResponse(res, { code: -2, msg: 'expired confirmation code resend done' });
            //         }
            //     })
            //     .catch((err) => {
            //         next(err);
            //     });
        } 
        else {
           userService.getUser({ email: tokenStatus.email}, ['emailConfirmed', 'codeValidation'])
                .then((user) => {
                    if (user.emailConfirmed === true) {
                        return responseMessage(res, statusCode.SuccessOK , { code: 1, msg: 'email confirmed' });
                    }
                    else if (user.codeValidation !== req.query.emailCode){
                        return responseMessage(res, statusCode.ClientErrorBadRequest, { code: -1, msg: 'invalid confirmation code' });
                    }
                    else {
                        userService.updateUser({ email: tokenStatus.email}, { emailConfirmed: true, $unset: { codeValidation: "" } })
                        .then((user) => {
                            if (!user) {
                                return responseMessage(res, statusCode.ClientErrorBadRequest, { code: -1, msg: 'invalid confirmation code' });      
                            } else {
                                return responseMessage(res, statusCode.SuccessOK, { code: 1, msg: 'email confirmed' });      
                            }
                        })
                        .catch((err) => {
                            next(err);
                        });
                    }
                })
                .catch((err) => {
                    next(err);
                })
        }
    },

    askResetPassword: (req: any, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseMessage(res, statusCode.ClientErrorBadRequest , errors.array()[0].msg);
        }
        const codeValidation = User.generateCode(req.body.email);
        userService.updateUser({ email: req.body.email }, { codeValidation })
            .then((user) => {
                if (!user) {
            return responseMessage(res, statusCode.SuccessOK , { code: -1, msg: 'bad credential' });
            
        } else {
            // mailer.resetPassword(req.body.email, codeValidation);
                    return responseMessage(res, statusCode.SuccessOK , { code: 1, msg: 'reset password mail sent' });
                }
            })
            .catch((err) => {
                next(err);
            });
    },

    // hedhy hassha zeyda
    // checkToken: (req, res, next) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return validationErrorResponse(res, errors.array()[0].msg);
    //     }
    //     const tokenStatus: IverifedToken = User.checkGeneratedCode(req.query.emailCode)
    //     if (tokenStatus.status === 'invalid') {
    //         return successResponse(res, { code: -1, msg: 'invalid confirmation code' });
    //     }
    //     if (tokenStatus.status === 'expired') {
    //         return successResponse(res, { code: -2, msg: 'expired confirmation code' });
    //     } else {
    //         userService.getUser({ email: tokenStatus.email, codeValidation: req.query.emailCode })
    //             .then((user) => {
    //                 if (!user) {
    //                     return successResponse(res, { code: -1, msg: 'invalid confirmation code' });
    //                 } else {
    //                     return successResponse(res, { code: 1, msg: 'valid confirmation code' });
    //                 }
    //             })
    //             .catch((err) => {
    //                 next(err);
    //             });
    //     }
    // },


    resetPassword: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const tokenStatus: IverifedToken = User.checkGeneratedCode(req.query.emailCode)

        if (tokenStatus.status === 'invalid') {
            return successResponse(res, { code: -1, msg: 'invalid confirmation code' });
        } else if (tokenStatus.status === 'expired') {
            return successResponse(res, { code: -2, msg: 'expired confirmation code' });
        } else {
            // laahne rod  belek yekhi tbaath toul update w ki yatlaa msh mawjoud
            userService.updateUser({ email: tokenStatus.email, codeValidation: req.query.emailCode }, { emailConfirmed: true, password: User.cryptPassword(req.body.password), $unset: { codeValidation: "" } })
                .then((user) => {
                    if (!user) {
                        return successResponse(res, { code: -1, msg: 'confirmation code not in marche'});
                    } else {
                        return successResponse(res, { code: 1, msg: 'password modified | you can login now' });
                    }
                })
                .catch((err) => {
                    next(err);
                });
        }
    }
}