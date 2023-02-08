// import { PropertyModel } from "../models/property.model";
import mongoose, { Query } from "mongoose";
import { PropertyModel } from "../models/property.model";
import { UserModel } from "../models/user.model";
import { IProperty } from "../types/property.type";
import { IUser } from "../types/user.type";

export const propertyService = {

    addTerrain: (data: IProperty): Promise<IProperty> => {
        return new Promise<IProperty>(async (resolve, reject) => {
            await PropertyModel.create(data).then((terrain: IProperty) => {
                resolve(terrain)
            }).catch((err) => reject(err))
        });
    },

    getProperty: (filter: object, toPopulate:any = "" ,selection:any = ''): Promise<any> => {
        return new Promise<any>(async (resolve, reject) => {
            await PropertyModel.find(filter)
                .populate(toPopulate, selection)
                // .populate("reservation")
                .then((terrain) => {
                    console.log(terrain)
                    resolve(terrain)
                })
                .catch((err) => reject(err))
        });
    },

    deleteProperty: (filter: object): Promise<{acknowledged: Boolean,deletedCount: Number}> => {
        return new Promise<{acknowledged: Boolean,deletedCount: Number}>(async (resolve, reject) => {
            // we use deleteOne instead of findOneAndDelete because it will return 
            await PropertyModel.deleteOne(filter)
                // .populate('reservation')
                .then((deleteRes) => {
                    // console.log('response of deleteOne()')
                    // console.log(terrain)
                    // the return here is: 
                    // { acknowledged: true, deletedCount: 1 }
                    resolve(deleteRes)
                })
                .catch((err) => reject(err))
        });
    },
    // getSingleTerrain: (filter: object): Promise<ITerrain> => {
    //     return new Promise<ITerrain>(async (resolve, reject) => {
    //         await Terrains.findOne(filter)
    //             .populate("owner")
    //             .populate("reservation")
    //             .then((terrain) => {
    //                 resolve(terrain)
    //             })
    //             .catch((err) => reject(err))
    //     });
    // },

    // getTerrain: (limit: number, page: number, filter: any = {}): Promise<[ITerrain[], number]> => {
    //     return new Promise<any>(async (resolve, reject) => {
    //         try {
    //             const result = await Promise.all([
    //                 Terrains.find(filter).limit(Number(limit)).skip((page - 1) * limit).sort({ 'updatedAt': 'desc' }).exec()
    //                 , // The lean option tells Mongoose to skip hydrating the result documents.
    //                 Terrains.countDocuments(filter)
    //             ]);
    //             resolve(result)
    //         }
    //         catch (err) {
    //             reject(err);
    //         }
    //     });
    // },
    updateProperty: (filter, update, option: object = { fields:'-password'}): Promise<IProperty> => {
        return new Promise<IProperty>(async (resolve, reject) => {
            await PropertyModel.findOneAndUpdate(filter, update, {...option,new: true})
                .then((property) => resolve(property))
                .catch((err) => reject(err))
        });
    },
    // getAll: (filter: any = {}): Promise<[ITerrain[], number]> => {
    //     return new Promise<any>(async (resolve, reject) => {
    //         try {
    //             const result = await Promise.all([
    //                 Terrains.find(filter).sort({ 'updatedAt': 'desc' }).exec()
    //                 , // The lean option tells Mongoose to skip hydrating the result documents.
    //                 Terrains.countDocuments(filter)
    //             ]);
    //             resolve(result)
    //         }
    //         catch (err) {
    //             reject(err);
    //         }
    //     });
    // },
    // getTerrainStats: (filter): Promise<[number, number]> => {
    //     return new Promise<[number, number]>(async (resolve, reject) => {
    //         Promise.all([
    //             Terrains.countDocuments(),
    //             Terrains.countDocuments(filter)
    //         ])
    //             .then((nbrterrain: [number, number]) => resolve(nbrterrain))
    //             .catch((err) => reject(err))
    //     });
    // },
}