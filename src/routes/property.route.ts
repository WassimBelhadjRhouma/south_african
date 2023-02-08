import { Router } from 'express';
import { propertyController } from '../controller/property.controller';
// import { paginationMiddleware } from '../middlewares/pagination.middleware';
import { checkRole } from '../middleware/permission.middleware';
import { Role } from '../models/user.model';
import { jwtProtect } from '../passport/passport.jwt';
import * as passport from 'passport';
import { propertyValidation } from '../validations/property.validation';

const propertyRoute = Router();


// propertyRoute.post('/add', checkRole([Role.admin, Role.proprietaire]), propertyValidation.addProperty, propertyController.addProperty);
propertyRoute.post('/add', propertyController.addProperty);

///////////////////////////////////////////// TODAYS WORK /////////////////////////////////////////////////////////
propertyRoute.put('/update', checkRole([Role.admin, Role.proprietaire]), propertyValidation.updateProperty, propertyController.updateProperty);


// propertyRoute.get('/admin', checkRole([Role.admin]), propertyValidation.adminGetproperty, paginationMiddleware, propertyController.getpropertys);

// propertyRoute.post('/owner', checkRole([Role.proprietaire, Role.admin]), propertyValidation.getProperty, paginationMiddleware, propertyController.getOwnerpropertys);

propertyRoute.get('/detail', propertyController.getProperty);

// propertyRoute.delete('/delete', checkRole([Role.admin, Role.proprietaire]), propertyValidation.deleteProperty, propertyController.deleteproperty);
// propertyRoute.delete('/delete', propertyValidation.deleteProperty, propertyController.deleteproperty);
propertyRoute.delete('/delete', propertyValidation.deleteProperty, checkRole([Role.admin, Role.proprietaire]), propertyController.deleteProperty);

// propertyRoute.post('/client', propertyValidation.getproperty, paginationMiddleware, propertyController.getpropertys);

// propertyRoute.post('/favorite/add', propertyValidation.manageFavorite, propertyController.addFavorite);
// propertyRoute.delete('/favorite/delete', propertyValidation.manageFavorite, propertyController.removeFavorite);
// propertyRoute.post('/all', propertyValidation.getproperty, propertyController.getAll);
// propertyRoute.get('/favorite', propertyController.getFavorite);

export default propertyRoute;
