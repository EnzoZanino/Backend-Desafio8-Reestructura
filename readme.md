agregamos los package:
    passport-jwt
    jsonwebtoken

configuramos en passport.config.js
    agregamos la strategia jwt
    borramos login del config
    agregamos el cookieExtractor

modificamos el user.model.js
    agregamos role y cart

agregamos la ruta jwt.router.js

vinculamos la app con la ruta jwt

modificamos login and register .js de public

agregamos en utils.js todo lo del jwt