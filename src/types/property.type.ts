import { ObjectId } from "mongoose";

export enum Pub_status {
    exam = 'exam',
    drafted = 'drafted',
    verified = 'verified'
}

export enum Transaction_type {
    rent = 'rent',
    sell = 'sell'
}

export enum Price_scale {
    total = 'total',
    month = 'month',
    week = 'week',
    year = 'year',
    m2 = 'm2',
    thsnd_m2 = 'thousand m2',
    hectare = 'hectare'
}
export enum Features {
    clima='climatise',
    chauf_c='chauffage centrale',
    chimine='chimine',
    garage='garage',
    parking_priv='garage',
    placeDeStationnement = 'place de stationnement',
    chat='chat',
    chien='chien'
}

export enum Listing_type {
    terrain = 'terrain',
    ferme = 'ferme',
    // 
    appartement = 'appartement',
    house = 'house(maison et villa)',
    shortRent = 'shortRent (location courte duree et vacance)',
    workingPlace = 'bureau et plateau',
    // 
    local = 'depot',
    commercial = 'commercial',
}

export interface IProperty{
    _id?: ObjectId;
    listing_type: string; // ferme / terrain / maison et villa / location de vaccance / appartement / etc ...
    title: string;
    description: string;
    exp_at?: Date;
    price: number;
    status: string;
    transaction_type: string;
    price_scale: string;
    surface: number;
    features: [string];
    location: {
        region: string,
        city: string,
        address?: string, // this is in case the use know how to exactly put it.
        position:{
            lat: number;
            lng: number;
        } 
    };
    bathroom: number;
    bedroom: number;
    publisher: any;
    // userDetails:{
    //     userName;
    //     userphoto;
    //     contactDetails
    // }
    // maybe for indexing we add a third property we maybe call it 
    // listedFor: 'habitation', 'lands', 'loceau commercieau' 
   
}
