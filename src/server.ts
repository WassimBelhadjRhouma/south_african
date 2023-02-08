import app from './app';
import { mongooseConnect } from './config/db.config';
import { Role, UserModel } from './models/user.model';
// import { winston } from "./config/winston.config";
// import run from './models/user.model';

import * as dotenv from "dotenv";
// dotenv.config({ path: `${__dirname}/../../.env` });
dotenv.config();

mongooseConnect
    .then(() => {
        app.listen(process.env.APP_PORT, () => {
            console.log(`App is listening on port ${process.env.APP_PORT}`);
            // run()
            // winston.info(`App is listening on port ${process.env.APP_PORT}`);
        });
    })
    .catch((e) => {
        console.log(e)
        // winston.error(e, () => {
        //     process.exit(1);
        // });
    });