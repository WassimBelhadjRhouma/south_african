import * as mongoose from 'mongoose';
// import { User, Users } from '../models/user.model';


// const url = "mongodb://localhost:27017";
export const mongooseConnect = new Promise<void>((resolve, reject) => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {

        // Users.create()

        resolve();
    }).catch((e) => {
        reject(e);
    });
});