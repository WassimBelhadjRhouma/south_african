import * as express from 'express';
import appRoutes from './routes';

import * as dotenv from "dotenv";
dotenv.config();

const app = express();
appRoutes(app);

export default app;
