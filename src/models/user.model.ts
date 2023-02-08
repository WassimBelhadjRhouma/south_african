import mongoose, { Document, Schema, Model, model,ObjectId } from 'mongoose'
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { IContactInfos, IUser, IverifedToken } from '../types/user.type';
// import { Terrain } from './terrain.model';
// import { Reservation } from './reservation.model';

export enum Role {
    admin = 'admin',
    proprietaire = 'proprietaire',
    client = 'client'
}


export class User implements IUser{
        _id: ObjectId;
        userName: string;
        email: string;
        password: string;
        image?: string;
        userType?: String;
        codeValidation: string;
        emailConfirmed: boolean;
        isBlocked: boolean;
        contactInfos?: IContactInfos;
        fullName: string;
        lmt_nbr: number;
        // cryptPassword(password: string): string;
        // comparePassword?(plainPassword: string, callback: any): any;   
        // limit_nbr?: number;
        // whichlist?: properties[];
        // property_posts?: properties[];
        // drafted_posts?: properties[];
        // commission_details: {
        //     siki: number
        // };
        // agents?: Schema.Types.ObjectId[];
        // terrain?: Terrain[];
    
        // constructor(data: any) {
        //     Object.assign(this, data);
        // }
    
        // comparePassword(plainPassword: string, callback: any) {
        //     bcrypt.compare(plainPassword, this.password, (err: Error, isMatch: boolean) => {
        //         callback(err, isMatch);
        //     });
        // }
    

        // I have a new idea here, is to verify if the user
        generateCode2(): string {
            return jwt.sign({ "id": this._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
            // return jwt.sign({ "id": this._id, this.createdAt }, process.env.JWT_SECRET, { expiresIn: '30d' })
        }

        static generateCode(email: string): string {
            // const timestamp = new Date().getTime();
            const randomNum = jwt.sign({ email}, process.env.JWT_SECRET, { expiresIn: '30d' })
            // const linkCode = timestamp + '-' + randomNum + '-' + Buffer.from(email).toString('hex');
            return randomNum;
        }
        
    static checkGeneratedCode(emailCode: string): IverifedToken{
        // emailCode decoded traja3 null kif yebda mahouch jwt
        const decodedJwt:any = jwt.decode(emailCode)
        if (!decodedJwt) {
            return { status: 'invalid' };
        }
        if(!decodedJwt.hasOwnProperty('email')){
            return { status: 'invalid' };
        }

        if (Date.now() >= decodedJwt.exp * 1000) {
            return { status: 'expired' };
        }
        // if ((Math.floor((Number(verifArr[0]) - new Date().getTime()) / 1000 / 60) + 60 * 24) < 1) {
        //     return { status: 'expired' };
        // }
        return { status: 'valid', email:decodedJwt.email };
    }

        static cryptPassword(password: string) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
        }
}




const userSchema: Schema = new Schema<IUser>({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    contactInfos: {
        type: Object,
        required: false,
        default: {}
    },
    userType: {
        type: String,
        enum: Role,
        default: 'client',
        required: false
    },
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    codeValidation: {
        type: String,
        required: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    image:{
        type: String,
        required: false
    },
    properties: [{
        type: Schema.Types.ObjectId,
        ref: "Property",
        required: false
    }],
    lmt_nbr: {
        type: Number,
        default: 4
    }

    // terrain: [{ type: Schema.Types.ObjectId, ref: 'Terrain' }],
    // reservation: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
    // favorite: [{ type: Schema.Types.ObjectId, ref: 'Terrain' }],

}, {
    // Assign a function to the "methods" object of our animalSchema through schema options.
    // By following this approach, there is no need to create a separate TS type to define the type of the instance functions.
    methods: {
        comparePassword(plainPassword: string, callback: any) {
            bcrypt.compare(plainPassword, this.password, (err: Error, isMatch: boolean) => {
                callback(err, isMatch);
            });
        },
        generateJwt(): string {
            return jwt.sign({ "id": this._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
        },
        // generateCode(email: string): string {
        //     const timestamp = new Date().getTime();
        //     const randomNum = Math.floor(Math.random() + 10000);
        //     const linkCode = timestamp + '-' + randomNum + '-' + Buffer.from(email).toString('hex');
        //     return linkCode;
        // }
    },
    // Hedhom some hojet yosl7o ki tebda 
    virtuals: {
        fullName: {
          get() {
            return this.userName+ ' ' + this.email;
          }
        }
      }
    ,
    timestamps: true
  } )

// userSchema.method('cryptPassword', function (password: string) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8));    
// });



// userSchema.method('comparePassword', User.prototype.comparePassword)
// userSchema.method('generateJwt', User.prototype.generateJwt)

const preSaveUser = function(next) {
    if (this.password) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) { return next(err); }
            bcrypt.hash(this.password, salt)
                .then((hash) => {
                    this.password = hash;
                    next();
                })
                .catch((err2) => {
                    next(err2);
                });
        });
    } else {
        next();
    }
}

userSchema.pre<IUser>("save", preSaveUser)

// export interface IUserDocument extends IUser,Document {}
// export interface IUserModel extends Model<IUser>{}

export const UserModel = model<IUser>("User", userSchema)


