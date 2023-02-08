import { propertyService } from "../service/property.service";
import { userService } from "../service/user.service";
import { IProperty } from "../types/property.type";
import { successResponse, unauthorizedResponse, validationErrorResponse } from "../utils/response.utils";
import { validationResult } from "express-validator";
import mongoose, { Document, Schema, Model, model,ObjectId } from 'mongoose'

// import { terrainService } from "../services/terrain.service";
// import { ITerrain, Terrain } from "../models/terrain.model";
// import { terrainRessource } from "../ressources/terrain.ressource";
// import { userService } from "../services/user.service";

export const limitation_number = 4
export const propertyController = {

    addProperty: async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        if(req.currentUser.lmt_nbr <= 0){
            return validationErrorResponse(res, {msg: "don't have space, we are sorry"});
        }
        const newProperty: IProperty = req.body;
        newProperty.publisher = req.currentUser._id
        // newTerrain.favorite = false
        propertyService.addTerrain(newProperty)
            .then((terrainCreated) => {
                if (!terrainCreated) {
                    return successResponse(res, { code: -1, msg: 'terrain not created', });
                }else{
                    // userService.updateUser({ _id: req.currentUser._id }, { $push: { properties: terrainCreated._id }, $inc:{lmt_nbr: -1 } }, { new: false, fields: '_id' })
                    userService.updateUser({ _id: req.currentUser._id }, { $push: { properties: terrainCreated._id }, $inc:{lmt_nbr: -1 } })
                        .then((user) => {
                            console.log(user)
                            if (!user) {
                                return unauthorizedResponse(res);
                            }
                            return successResponse(res, { code: 1, msg: 'terrain created' });
                        })
                        .catch((err) => {
                            next(err)
                        });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    getProperty: (req, res, next) => {

        // const { id } = req.query
        // filter = req.query
        //console.log(req.query)

        // propertyService.getProperty({ _id: id },'publisher', ['userName', 'contactInfos', 'userType', 'image'])
        propertyService.getProperty(req.query)
            .then((terrain) => {
                if (!terrain) {
                    return successResponse(res, { code: -1, msg: 'property not found' })
                }
                return successResponse(res, {
                    terrain,
                    code: 1,
                    msg: 'property found'
                });
            })
            .catch((err) => {
                next(err);
            });
    },

    updateProperty: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        const { terrain_id, terrain } = req.body;

        propertyService.updateProperty({ _id: terrain_id }, terrain)
            .then((terrain: IProperty) => {
                if (!terrain) {
                    return unauthorizedResponse(res);
                } else {
                    return successResponse(res, { code: 1, msg: 'terrain updated' });
                }
            })
            .catch((err) => {
                next(err);
            });
    },
    deleteProperty: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationErrorResponse(res, errors.array()[0].msg);
        }
        // console.log(req.currentUser.properties.indexOf(req.query.property))
        if(req.currentUser.properties.indexOf(req.query.property) === -1){
            return unauthorizedResponse(res, {msg: 'aya ched 9adrek'});
        }else{
            console.log("here");
            
            propertyService.deleteProperty({ _id: req.query.property })
                .then((terrainDeleted) => {
                    if (terrainDeleted.deletedCount===0 ) {
                        return successResponse(res, { code: -1, msg: "smth went wrong | Property not found" });
                    } else {
                        if(req.currentUser.lmt_nbr < limitation_number){
                           req.currentUser.lmt_nbr +=  1
                        }
                        userService.updateUser({ _id: req.currentUser._id }, { $pull: { properties: req.query.property }, lmt_nbr: req.currentUser.lmt_nbr}, {fields: 'properties'})
                            .then((user) => {
                                console.log(user);
                                if (!user) {
                                    // hedhy importante, idha ken l user msh mwjoud donc fama la3ba
                                    return unauthorizedResponse(res);
                                }else if(user.properties.indexOf(req.query.property) !== -1){
                                    return successResponse(res, { code: 1, msg: 'smth went wrong | Property not deleted from user'});
                                }
                                return successResponse(res, { code: 1, msg: 'terrain deleted' });
                            })
                            .catch((err) => {
                                next(err)
                            });
                    }
                })
                .catch((err) => {
                    next(err);
                })
        }
    },

    // getTerrains: (req, res, next) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return validationErrorResponse(res, errors.array()[0].msg);
    //     }
    //     const { page, limit, filter } = req.body
    //     terrainService.getTerrain(limit, page, filter)
    //         .then((response) => {
    //             return successResponse(res, {
    //                 terrains: response[0].map((terrain) => terrainRessource.getTerrain(terrain)),
    //                 total: response[1],
    //                 code: 1,
    //                 msg: 'terrains list'
    //             });
    //         })
    //         .catch((err) => {
    //             next(err);
    //         });
    // },

    // getOwnerTerrains: (req, res, next) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return validationErrorResponse(res, errors.array()[0].msg);
    //     }
    //     const { page, limit, filter } = req.body
    //     if (filter) {
    //         filter.owner = req.currentUser._id
    //     }
    //     terrainService.getTerrain(limit, page, filter)
    //         .then((response) => {
    //             return successResponse(res, {
    //                 terrains: response[0].map((terrain) => terrainRessource.getTerrain(terrain)),
    //                 total: response[1],
    //                 code: 1,
    //                 msg: 'terrains list'
    //             });
    //         })
    //         .catch((err) => {
    //             next(err);
    //         });
    // },
    // getSingleTerrain: (req, res, next) => {

    //     const { id } = req.query

    //     terrainService.getSingleTerrain({ _id: id })
    //         .then((terrain) => {
    //             if (!terrain) {
    //                 return successResponse(res, { code: -1, msg: 'terrain not found' })
    //             }
    //             return successResponse(res, {
    //                 terrain,
    //                 code: 1,
    //                 msg: 'terrain found'
    //             });
    //         })
    //         .catch((err) => {
    //             next(err);
    //         });
    // },
    // addFavorite: async (req, res, next) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return validationErrorResponse(res, errors.array()[0].msg);
    //     }
    //     const { terrain_id } = req.body;

    //     userService.updateUser({ _id: req.currentUser._id }, { $push: { favorite: terrain_id } })
    //         .then((user) => {
    //             if (!user) {
    //                 return unauthorizedResponse(res);
    //             } else {
    //                 return successResponse(res, { code: 1, msg: 'terrain added to favorite' });
    //             }
    //         })
    //         .catch((err) => {
    //             next(err)
    //         });
    // },
    // removeFavorite: async (req, res, next) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return validationErrorResponse(res, errors.array()[0].msg);
    //     }
    //     const { terrain_id } = req.query;

    //     userService.updateUser({ _id: req.currentUser._id }, { $pull: { favorite: { $in: [terrain_id] } } })
    //         .then((user) => {
    //             if (!user) {
    //                 return unauthorizedResponse(res);
    //             } else {
    //                 return successResponse(res, { code: 1, msg: 'terrain Deleted from favorite' });
    //             }
    //         })
    //         .catch((err) => {
    //             next(err)
    //         });
    // },
    // getAll: async (req, res, next) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return validationErrorResponse(res, errors.array()[0].msg);
    //     }
    //     const { filter } = req.body;

    //     terrainService.getAll(filter)
    //         .then((data) => {
    //             if (!data) {
    //                 return unauthorizedResponse(res);
    //             } else {

    //                 let terrains = data[0].map((terrain) => {
    //                     return {
    //                         _id: terrain._id,
    //                         position: terrain.position,
    //                         price: terrain.price,
    //                         capacity: terrain.capacity,
    //                         region: terrain.region,
    //                         city: terrain.city,
    //                         owner: terrain.owner,
    //                         title: terrain.title,
    //                         description: terrain.description,
    //                         reservation: terrain.reservation,
    //                         favorite: req.currentUser.favorite.includes(terrain._id) ? true : false,
    //                     }
    //                 })

    //                 return successResponse(res, { code: 1, msg: 'terrain detailed list', terrains, total: data[1] });
    //             }
    //         })
    //         .catch((err) => {
    //             next(err)
    //         });
    // },
    // getFavorite: async (req, res, next) => {
    //     userService.getUser({ _id: req.currentUser._id })
    //         .then((user) => {
    //             if (!user) {
    //                 return unauthorizedResponse(res);
    //             }
    //             return successResponse(res, { code: 1, msg: "favorite list", favorite: user.favorite })
    //         })
    //         .catch((err) => next(err))
    // },
}

