import * as cors from 'cors';

import authRoute from "./auth.route";

import * as express from 'express';
import { globalError } from '../utils/response.utils';
import propertyRoute from './property.route';
import { passportMiddleware } from '../middleware/passport.middleware';


import * as dotenv from "dotenv";
dotenv.config();
export default function appRoutes(app) {
    app.use(cors());
    app.use(express.json());
    // app.use(passport.initialize());
// app.use(passport.session());
    app.get('/ping', async (_req, res) => {
        res.send('PONG API HAYAKAWER');
    });

    // app.use('/api/v0/docs', swagger.serve, swagger.setup(swaggerConfig));
    // app.use('/api/v0/auth', authRoute);
    // app.use('/api/v0/user', passportMiddleware.passportJwtProtect, userRoute);
    app.use('/api/v0/auth', authRoute);

    // app.use('/api/v0/terrain', passportMiddleware.passportJwtProtect, terrainRoute);

    app.use('/api/v0/property', passportMiddleware.passportJwtProtect, propertyRoute);

    // app.use('/api/v0/users', passportMiddleware.passportJwtProtect, usersRoute);

    // app.use('/api/v0/reservation', passportMiddleware.passportJwtProtect, reservationRoute);

    // app.use('*', async (req, res) => {
    //     return NotFoundErrorResponse(res);
    // });
    app.use(globalError)
}