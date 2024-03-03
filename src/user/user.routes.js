import express from "express";

import { validateJwt, isTeacher, isStudent } from "../middlewares/validate-jws.js";
import { test, saveTeacher, saveStudent, logins, courses, myCourses, assignMe} from "./user.controller.js";

const api = express.Router();

api.post('/logins', logins);
api.post('/saveTeacher', saveTeacher);
api.post('/saveStudent', saveStudent);
api.get('/test', [validateJwt, isTeacher], test);


api.get('/courses', [validateJwt],courses);
api.get('/myCourses', [validateJwt], myCourses);
api.put('/assignMe', [validateJwt, isStudent],assignMe);


export default api;