import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../models/user.model.js';
// import { createHash, isValidPassword } from '../utils.js';

import jwtStrategy from 'passport-jwt';
import { PRIVATE_KEY, createHash } from '../utils.js';

//  Declaramos estrategia
const localStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {

    
    //Estrategia de obtener Token JWT por Cookie:
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT.");
            try {
                console.log("JWT obtenido del Payload");
                console.log(jwt_payload);
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ));

    /**
          *  Inicializando la estrategia local, username sera para nosotros email.
          *  Done será nuestro callback
         */

    passport.use('register', new localStrategy(
        // passReqToCallback: para convertirlo en un callback de request, para asi poder iteracturar con la data que viene del cliente
        // usernameField: renombramos el username
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            // se borra de const y aqui se utiliza el password desde los parametros de la async function
            console.log("Registrando usuario:");
            console.log(req.body); 
            
            try {
                //Validamos si el user existe en la DB
                const exist = await userModel.findOne({ email });
                if (exist) {
                    console.log("El user ya existe!!");
                    done(null, false)
                }

                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    // password //se encriptara despues...
                    password: createHash(password)
                }
                const result = await userModel.create(user);
                // Todo sale ok
                return done(null, result)
            } catch (error) {
                return done("Error registrando al usuario " + error);
            }
        }
    ))

    //Funciones de Serializacion y Desserializacion
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user)
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    })
    // estas funciones permiten a Passport.js manejar la información del usuario
    // durante el proceso de autenticación, serializando y deserializando los usuarios 
    // para almacenar y recuperar información de la sesión. Estas funciones son esenciales 
    // cuando se implementa la autenticación de usuarios en una aplicación Node.js utilizando 
    // Passport.js.
}

const cookieExtractor = req => {
    let token = null;
    console.log("Entrando a Cookie Extractor");
    if (req && req.cookies) {//Validamos que exista el request y las cookies.
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']
        console.log("Token obtenido desde Cookie:");
        console.log(token);
    }
    return token;
};

export default initializePassport;