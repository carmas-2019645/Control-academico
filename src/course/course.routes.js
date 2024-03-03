import express from 'express';
import { validateJwt, isTeacher} from '../middlewares/validate-jws.js';
import {testC, register} from './course.controller.js';

const api = express.Router();

//rutas publicas
api.get('/testC', [validateJwt, isTeacher], testC);

//rutas privadas
api.post('/register', [validateJwt, isTeacher],register);

//api.get('/allcourses', [validateJwt], courses);

export default api;