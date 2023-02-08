import { UserModel } from "../models/user.model"
import { IUser } from "../types/user.type";
// import { ObjectId } from 'mongoose'

export const userService = {
    getUser: (filter: object, selection:any = ''): Promise<IUser> => {
        return new Promise<IUser>(async (resolve, reject) => {
            await UserModel.findOne(filter).select(selection)
                // .populate('terrain')
                // .populate('reservation')
                // .populate('favorite')
                .then((user: IUser) => {
                    resolve(user)
                })
                .catch((err) => reject(err))
        });
    },
    checkExistance: (filter: object): Promise<any> => {
        return new Promise<any>(async (resolve, reject) => {
            await UserModel.exists(filter)
                // UserModel.exists returns either the id of the user 
                // or Null value when there is no existance for this in the database

                // WARNING: CHECK THE USER'S RETURN TYPE
                .then((user: any) => {
                        resolve(user)
                })
                .catch((err) => reject(err))
        });
    },
    // getUsers: (limit: number, page: number, filter: object = {}): Promise<[IUser[], number]> => {
    //     return new Promise<[IUser[], number]>(async (resolve, reject) => {
    //         Promise.all([
    //             UserModel.find(filter).limit(Number(limit)).skip((page - 1) * limit).sort({ 'updatedAt': 'desc' }).exec(), // The lean option tells Mongoose to skip hydrating the result documents.
    //             UserModel.countDocuments(filter)
    //         ])
    //             .then((suc: [IUser[], number]) => {
    //                 resolve(suc);
    //             })
    //             .catch((err) => {
    //                 reject(err);
    //             })
    //     });
    // },
    addUser: (data: IUser): Promise<IUser> => {
        return new Promise<IUser>(async (resolve, reject) => {
            await UserModel.create(data).then((user: IUser) => {
                resolve(user)
            }).catch((err) => reject(err))
        });
    },
    updateUser: (filter, update, option: object = { fields:'-password'}): Promise<IUser> => {
        return new Promise<IUser>(async (resolve, reject) => {
            await UserModel.findOneAndUpdate(filter, update, {...option,new: true})
                .then((user) => resolve(user))
                .catch((err) => reject(err))
        });
    },
    deleteUser: (filter: object): Promise<IUser> => {
        return new Promise<IUser>(async (resolve, reject) => {
            await UserModel.findOneAndDelete(filter)
                .populate('reservation')
                .populate('terrain')
                .then((user) => resolve(user))
                .catch((err) => reject(err))
        });
    },
    getStats: (filter: object = {}): Promise<[number, number]> => {
        return new Promise<[number, number]>(async (resolve, reject) => {
            Promise.all([
                UserModel.countDocuments(),
                UserModel.countDocuments(filter)
            ])
                .then((suc: [number, number]) => {
                    // console.log(suc)
                    resolve(suc);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    },

}