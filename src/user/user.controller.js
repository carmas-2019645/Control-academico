import {generateJwt} from '../utils/jwt.js'
import { checkPassword, checkUpdate, encrypt } from './../utils/validator.js';
import Course from '../course/course.model.js'
import User from './user.model.js'
import jwt from 'jsonwebtoken'

export const test = (req, res) => {
    console.log('user test is running.')
    return res.send({ message: `User test is running.` });
}

export const saveTeacher = async (req, res) => {
    try {
        let data = req.body;
        //encriptar la contrasenia
        data.password = await encrypt(data.password);

        //si el no ingreso role, le asignamos uno por defecto
        if (!data.role) data.role = 'TEACHER';

        //creamos nuestro usuario
        let user = new User(data);
        //guardamos en mongo
        await user.save();
        //respondemos al usuario
        return res.send({ message: `Registered successfully. \nCan be logged with username ${user.username}` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error registering user. | `, err: err.errors })
    }
}

export const saveStudent = async (req, res) => {
    try {
        let data = req.body;
        //encriptar la contrasenia
        data.password = await encrypt(data.password);

        //le asignamos rol por defecto
        data.role = 'STUDENT';
        //creamos nuestro usuario
        let user = new User(data);
        //guardamos en mongo
        await user.save();
        //respondemos al usuario
        return res.send({ message: `Registered successfully. \nCan be logged with username ${user.username}` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error registering user. | `, err: err.errors })
    }
}


export const courses = async (req, res) => {
    try {

        //recuperar el token
        let { token } = req.headers;

        //validar si es estudiante o profesor
        let { role, uid } = jwt.verify(token, process.env.SECRET_KEY);
        if (!role) return res.status(400).send({ message: `User role not found from token.` });

        switch (role) {
            case 'TEACHER':
                let resultsTeacher = await Course.find({ teacher: uid });
                return res.send({ resultsTeacher });
            case 'STUDENT':
                let resultsStudent = await Course.find().populate('teacher', ['name', 'surname', 'email']);
                return res.send({ resultsStudent });
        }


    } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error showing courses: ${err.message}` });
    }
}

export const myCourses = async (req, res) => {
    try {
        //recuperar el token
        let { token } = req.headers;

        //validar si es estudiante o profesor
        let { role, uid } = jwt.verify(token, process.env.SECRET_KEY);
        if (!role) return res.status(400).send({ message: `User role not found from token.` });

        switch (role) {
            case 'TEACHER':
                let resultsTeacher = await Course.find({ teacher: uid });
                return res.send({ resultsTeacher });
            case 'STUDENT':
                let { courses } = await User.findOne({ _id: uid }).populate('courses', ['name', 'section']);
                return res.send({ courses });
        }
    } catch (err) {
        console.error(err);

    }
}

export const assignMe = async (req, res) => {
    try {
        let { token } = req.headers;
        let { courses } = req.body;
        console.log(courses);
        let { role, uid } = jwt.verify(token, process.env.SECRET_KEY);
        if (!role) return res.status(400).send({ message: `User role not found from token.` });


        //validar que tenga menos de tres cursos
        let validate = await User.findOne({ _id: uid });
        let pivotCourses = validate.courses;
        if (pivotCourses.length >= 3) return res.status(400).send({ message: `You have reached the limit to courses` })

        //validar que no me asigne a un curso ya asignado
        if (validate.courses.includes(courses)) {
            return res.status(400).send({ message: `You are already assigned to this course.` });
        }

        //validar que exista el curso
        let course = await Course.findOne({ _id: courses });
        if (!course) return res.status(404).send({ message: `Course not found.` });

        //meter el id del curso a mis cursos (usuario)
        let register = await User.findOneAndUpdate(
            { _id: uid },
            { $push: { courses } },
            { new: true }
        ).populate('courses', ['name', 'section']);
        if (!register) return res.status(400).send({ message: `Error while assigning course to student.` })
        

        return res.send({ message: `New course asigned`, course });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `ERROR TO ASSIGN` })
    }
}

export const logins = async (req, res) => {
    try {
        let { username, password } = req.body;
        let user = await User.findOne({ username });
        if (!user) return res.status(404).send({ message: `Invalid credentials.` })

        if (await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }

            //generar el token y enviarlo como respuesta.
            let token = await generateJwt(loggedUser);
            return res.send({
                message: `WELCOME ${user.username}`,
                loggedUser,
                token
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `ERROR IN LOGIN` });
    }
}
