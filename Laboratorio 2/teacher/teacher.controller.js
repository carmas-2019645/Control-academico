export const login = async (req, res) => {
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

export const update = async (req, res) => {
    try {
        //extraer id
        let { id } = req.params;
        //extraer datos a actualizar
        let data = req.body;
        //validar si trae datos y si se pueden modificar.
        if (!checkUpdate(data, id)) return res.status(400).send({ message: `Have submitted some data that cannot be updated or missing data` });

        //actualizar
        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updatedUser) return res.status(401).send({ message: `User not found and not updated.` });
        return res.send({ message: `Update user`, updatedUser });
    } catch (err) {
        console.error(err);
        if (err.keyValue.username) return res.status(400).send({ message: `Username @${err.keyValue.username} is al ready token.` })
        return res.status(500).send({ message: `Error updating profile.` })
    }
}


export const deleteU = async () => {
    try {
        let { token } = req.headers;
        let { id } = req.params;
        let { wordCheck } = req.body;
        //validar si esta logeado
        if (!token) return res.status(401).send({ message: `Token is required. | Login required.` })

        //extraer el id y el role
        let { role, uid } = jwt.verify(token, process.env.SECRET_KEY);

        switch (role) {
            case 'TEACHER':
                // Eliminar al profesor y los cursos que tiene a su cargo
                let deletedTeacher = await User.findOneAndDelete({ _id: id });
                if (!deletedTeacher) return res.status(400).send({ message: `Teacher not found and not deleted.` });

                //validar palabra de confirmacion
                if (!wordCheck) return res.status(400).send({ message: `wordCheck IS REQUIRED.` });
                if (wordCheck !== 'CONFIRM') return res.status(400).send({ message: `wordCheck must be -> CONFIRM` });
                
                // Eliminar los cursos del profesor
                let deletedCourses = await Course.deleteMany({ teacher: id });
                if (!deletedCourses) return res.status(400).send({ message: `Courses not found and not deleted.` });

                // Desvincular a los alumnos de los cursos del profesor
                await Promise.all(deletedCourses.map(async (course) => {
                    await User.updateMany({ courses: course._id }, { $pull: { courses: course._id } });
                }));

                return res.send({ message: `Teacher with username @${deletedTeacher.username} deleted successfully along with associated courses.` });
            case 'STUDENT':
                //validar palabra de confirmacion
                if (!wordCheck) return res.status(400).send({ message: `wordCheck IS REQUIRED.` });
                if (wordCheck !== 'CONFIRM') return res.status(400).send({ message: `wordCheck must be -> CONFIRM` });

                //eliminar (usuario)
                let deleted = await User.findOneAndDelete({ _id: id });
                //verificar que se elimino
                if (!deleted) return res.status(400).send({ message: `Profule not found and not deleted.` });
                return res.send({ message: `Account with username @${deleted.username} deleted successfully.` });
        }

    } catch (err) {
        console.error(err);

    }
}

export const createTeacher = async () => {
    try {
        let user = await User.findOne({ username: 'jnoj' });
        if (!user) {
            console.log('Creando profesor...')
            let teacher = new User({
                name: 'Josue',
                surname: 'Noj',
                username: 'jnoj',
                password: '12345',
                email: 'jnoj@kinal.org.gt',
                phone: '87654321',
                role: 'TEACHER'
            });
            teacher.password = await encrypt(teacher.password);
            await teacher.save();
            return console.log({ message: `Registered successfully. \nCan be logged with username ${teacher.username}` })
        }
        console.log({ message: `Can be logged with username ${user.username}` });

    } catch (err) {
        console.error(err);
        return err;
    }
}