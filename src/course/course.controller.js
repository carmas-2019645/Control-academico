import Course from './course.model.js'
import jwt from 'jsonwebtoken'

export const testC = (req, res) => {
    console.log('test is running');
    res.send({ message: `test is running Cources` })
}

export const register = async (req, res)=>{
    try{
        let {token} = req.headers;
        let data = req.body;

        if(!data) return res.status(400).send({message: `There is empty data here`});

        let matter = await Course.findOne({name: data.name, section: data.section});
        if(matter) return res.status(400).send({message: `Error | The course already exists in the database`})

        let {uid} = jwt.verify(token, process.env.SECRET_KEY);

        if(!uid) return res.status(400).send ({message: `The teacher with the of was not found with the identifier` })
        data.teacher = uid;

        let course = new Course(data);

        await course.save();

        return res.send({message: `Successfully created course`})

    }catch (err) {
        console.error(err);
        res.status(500).send({message:`Error trying to create the course. | `, err: err.errors})
    }
}