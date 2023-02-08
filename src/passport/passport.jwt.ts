import { ExtractJwt, Strategy } from 'passport-jwt';
import { userService } from "../service/user.service";
import * as dotenv from 'dotenv';
dotenv.config()


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

export const jwtProtect = new Strategy(jwtOptions, (payload, done) => {
    userService.getUser({ _id: payload.id },['_id', 'lmt_nbr', 'properties','userType'])
        .then((user) => {
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'user dosent exist' } );
            }
        }).catch(err => done(err, false))
});

