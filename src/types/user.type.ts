import { Document, Schema, Model, model,ObjectId } from 'mongoose'




export interface IContactInfos {
    addresses?: Array<string>;
    whatsapp?: string;
    phoneNumbers?: Array<string>;
  }

  export interface IverifedToken {
    status: 'expired' | 'invalid' | 'valid';
    email?: string;
}
export interface IUser{
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
    properties?: any;
    // property_posts?: ObjectId[];
    // cryptPassword(password: string): string;
    comparePassword?(plainPassword: string, callback: any): any;   
    lmt_nbr?: number;
    // whichlist?: properties[];
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

    // generateJwt(): string {
    //     return jwt.sign({ "id": this._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    // }

    // static generateCode(email: string): string {
    //     const timestamp = new Date().getTime();
    //     const randomNum = Math.floor(Math.random() + 10000);
    //     const linkCode = timestamp + '-' + randomNum + '-' + Buffer.from(email).toString('hex');
    //     return linkCode;
    // }


    // static cryptPassword(password: string) {
    //     return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    // }
    

   
}
