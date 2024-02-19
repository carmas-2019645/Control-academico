import { Router } from "express";

import { validateJwt, isTeacher, isStudent } from "../middlewares/validate-jwt.js";
import { test, login, myCourses, assignMe,registerTeacher, registerStudent, courses } from "./teacher.controller.js";

const api = Router();

api.post('/login', login);
api.post('/registerTeacher', registerTeacher);
api.post('/registerStudent', registerStudent);
api.get('/test', [validateJwt, isTeacher], test);


api.get('/courses', [validateJwt],courses);
api.get('/myCourses', [validateJwt], myCourses);
api.put('/assignMe', [validateJwt, isStudent],assignMe);


export default api;