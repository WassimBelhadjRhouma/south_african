import { check } from 'express-validator';
import * as mongoose from 'mongoose';
export const propertyValidation = {
    addProperty: [
        check('title').exists().withMessage({ msg: 'title required' }).isString().withMessage({ msg: 'title invalid' }),
        check('description').exists().withMessage({ msg: 'description required' }).isString().withMessage({ msg: 'description invalid' }),
        check('price').exists().withMessage({ msg: 'price required' }).isNumeric().withMessage({ msg: 'price invalid' }),
        check('capacity').exists().withMessage({ msg: 'capacity required' }).isNumeric().withMessage({ msg: 'capacity invalid' }),
        check('region').exists().withMessage({ msg: 'region required' }).isString().withMessage({ msg: 'region invalid' }),
        check('city').exists().withMessage({ msg: 'city required' }).isString().withMessage({ msg: 'city invalid' }),
        check('position').exists().withMessage({ msg: 'position required' }).isObject().withMessage({ msg: 'position invalid' }),
        check('position.lat').exists().withMessage({ msg: 'lat required' }).isNumeric().withMessage({ msg: 'lat invalid' }),
        check('position.lng').exists().withMessage({ msg: 'lng required' }).isNumeric().withMessage({ msg: 'lng invalid' }),
    ],
    deleteProperty: [
        check('property').exists().withMessage({ msg: 'Property id required' })
            // .custom((Property) => {
            //     if (!mongoose.Types.ObjectId.isValid(Property)) {
            //         return false;
            //     }
            //     return true;
            // })
            // .withMessage({ msg: 'id invalid' })
        // check('filter').exists().withMessage({ msg: 'Filter required' }).isObject().withMessage({ msg: "Filter Invalid" })
        //     .customSanitizer((filter) => {
        //         const newFilter: any = {};
        //         const PropertyAttributes = ["owner", "_id"]
        //         for (const key of Object.keys(filter)) {
        //             if (PropertyAttributes.includes(key) && mongoose.Types.ObjectId.isValid(filter[key])) {
        //                 newFilter[key] = filter[key];
        //             }
        //         }
        //         return newFilter;
        //     })
        //     .custom((filter) => {
        //         if (Object.keys(filter).length === 0) {
        //             return false;
        //         }
        //         return true;
        //     }).withMessage({ msg: 'filter invalid' })
    ],
    adminGetProperty: [
        check('filter').optional().isObject().withMessage({ msg: 'filter invalid' })
        .customSanitizer((filter) => {                                                    
                const newFilter: any = {};
                const PropertyAttributes = ["title", "capacity", "price", "region", "city", "position", "owner"]
                for (const key of Object.keys(filter)) {
                    if (PropertyAttributes.includes(key)) {
                        if (key === 'position') {
                            if (Object.keys(filter.position).length === 2 && !isNaN(filter.position.lat) && !isNaN(filter.position.lng)) {
                                newFilter[key] = filter[key];
                            }
                        } if (key === 'owner') {
                            if (mongoose.Types.ObjectId.isValid(filter[key])) {
                                newFilter[key] = filter[key];
                            }
                        } else {
                            newFilter[key] = filter[key];
                        }
                    }
                }
                return newFilter;
            })
            .custom((filter) => {
                if (Object.keys(filter).length === 0) {
                    return false;
                }
                return true;
            }).withMessage({ msg: 'filter invalid' })
    ],
    getProperty: [
        check('filter').optional().isObject().withMessage({ msg: 'filter invalid' })
            .customSanitizer((filter) => {
                const newFilter: any = {};
                const PropertyAttributes = ["title", "capacity", "price", "region", "city", "position", "$or"]
                for (const key of Object.keys(filter)) {
                    if (PropertyAttributes.includes(key)) {
                        if (key === 'position') {
                            if (Object.keys(filter.position).length === 2 && !isNaN(filter.position.lat) && !isNaN(filter.position.lng)) {
                                newFilter[key] = filter[key];
                            }
                        } else {
                            newFilter[key] = filter[key];
                        }
                    }
                }
                return newFilter;
            })
    ],
    manageFavorite: [
        check('Property_id').exists().withMessage({ msg: 'Property id required' })
            .custom((Property) => {
                if (!mongoose.Types.ObjectId.isValid(Property)) {
                    return false;
                }
                return true;
            })
            .withMessage({ msg: 'id invalid' })
    ],
    updateProperty: [
        check('Property_id').exists().withMessage({ msg: 'Property id required' })
            .custom((Property) => {
                if (!mongoose.Types.ObjectId.isValid(Property)) {
                    return false;
                }
                return true;
            })
            .withMessage({ msg: 'id invalid' }),
            check('Property').exists().isObject().withMessage({ msg: 'Property required' })
            .customSanitizer((Property) => {
                const newProperty: any = {};
                const PropertyAttributes = ["title", "capacity", "price", "location", "description"]
                for (const key of Object.keys(Property)) {
                    if (PropertyAttributes.includes(key)) {
                        if (key === 'position') {
                            if (Object.keys(Property.position).length === 2 && !isNaN(Property.position.lat) && !isNaN(Property.position.lng)) {
                                newProperty[key] = Property[key];
                            }
                        } else {
                            newProperty[key] = Property[key];
                        }
                    }
                }
                return newProperty;
            })
        ,
    ]
};
