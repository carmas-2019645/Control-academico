//Levantar servidor HTTP (express)
//ESModules 
'use strict'

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { config } from 'dotenv';
import autoRoutes from '../src/curso/curso.routes.js'


//configuracion
const app = express();
config();
const port = process.env.PORT || 3056;

//configuracion del servidor
app.use(express.urlencoded({extended:'false'}));
app.use(express.json());
app.use(cors());//Aceptar o denegar solicitudes de diferentes origenes (local, remoto) / politicas de acceso
app.use(helmet());//Aplica capa de seguridad basica al servidor
app.use(morgan('dev'))//logs de solicitudes al servidor


//Declaracion de rutas
app.use(autoRoutes)


export const initServer = ()=>{
    app.listen(port);
    console.log(`Server HTTP runing in port ${port}`);
}


