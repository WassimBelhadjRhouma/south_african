import {Schema, model } from 'mongoose'
import { Features, IProperty, Listing_type, Price_scale, Pub_status, Transaction_type } from '../types/property.type';


const proprtySchema: Schema = new Schema<IProperty>({
    listing_type: {
        type: String,
        default: 'appartement',
        enum: Listing_type,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    exp_at: {
        type: Date
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: Pub_status,
        default: 'exam',
        required: false
    },
    transaction_type: {
        type: String,
        enum: Transaction_type,
        default: 'rent',
        required: true
    },
    price_scale: {
        type: String,
        enum: Price_scale,
        default: 'month'
    },
    surface: {
        type: Number,
        required: false
    },
    features: {
        type: [String],
        enum: Features,
        required: false
    },
    location: {
        region: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: false
        },
        // this is in case the use know how to exactly put it.
        position:{
            lat: {
                type: Number,
                required: true    
            },
            lng: {
                type: Number,
                required: true    
            }
        } 
    },
    bathroom: {
        type: Number,
        required: false
    },
    bedroom: {
        type: Number,
        required: false
    },
    publisher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

},{ 
    timestamps: true })

// userSchema.method('cryptPassword', function (password: string) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8));    
// });



// userSchema.method('comparePassword', User.prototype.comparePassword)

// export interface IUserDocument extends IUser,Document {}
// export interface IUserModel extends Model<IUser>{}

export const PropertyModel = model<IProperty>("Property", proprtySchema)


