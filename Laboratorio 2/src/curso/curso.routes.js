import { Router } from 'express';
import { validateJwt, isTeacher} from '../middlewares/validate-jwt.js';
import { test, keep, courses} from './course.controller.js';

const api = Router();

api.get('/test', [validateJwt, isTeacher], test);
api.post('/keep', [validateJwt, isTeacher],keep);
api.get('/courses', [validateJwt], courses);

export default api;