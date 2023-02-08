import { Router } from 'express';
import { authController } from '../controller/auth.controller';
import { authValidation } from '../validations/auth.validations';
// import { authValidation } from '../validation/auth.validation';
import * as passport from 'passport';
import { localLogin } from '../passport/passport.local';
import { passportMiddleware } from '../middleware/passport.middleware';
import { jwtProtect } from '../passport/passport.jwt';
// import { localLogin } from '../passport/passport.local';
// import { fbLogin } from '../passport/passport-facebook';
// import { googleLogin } from '../passport/passport.google';
// import { passportMiddleware } from '../middlewares/passport.middleware';

passport.use(localLogin);
// passport.use(googleLogin);
// passport.use(fbLogin);
passport.use(jwtProtect);



// To use Passport in an Express or Connect-based application, configure it 
// with the required passport.initialize() middleware. If your
// application uses persistent login sessions (recommended, 
// but not required), passport.session() middleware must also be used.
//app.use(passport.initialize());
//app.use(passport.session());


const authRoute = Router();

authRoute.post('/signup', authValidation.signup, authController.emailSignup);

authRoute.post('/signin', authValidation.signin, passportMiddleware.passportSignIn, authController.signin);

// authRoute.post('/signin/fb', passportMiddleware.passportSignInFacebook, authController.signin);

// authRoute.post('/signin/google', passportMiddleware.passportSignInGoogle, authController.signin);

authRoute.get('/confirm-email', authValidation.emailConfirmation, authController.emailConfirmation);

authRoute.post('/ask-reset-password', authValidation.askResetPassword, authController.askResetPassword);

// hedhy 7assha zeyda
// authRoute.get('/check-token', authValidation.checkToken, authController.checkToken);

authRoute.post('/reset-password', authValidation.resetPassword, authController.resetPassword);

export default authRoute;
