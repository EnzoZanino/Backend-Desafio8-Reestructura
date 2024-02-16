import { Router } from 'express';
// import userModel from '../../models/user.model.js'; YA NO SE UTILIZA POR PASSPORT
// import { createHash, isValidPassword } from '../../utils.js' YA NO SE UTILIZA POR PASSPORT
import passport from 'passport';

const router = Router();

// Register
router.post('/register', passport.authenticate('register', { failureRedirect: 'api/session/fail-register'}), async (req, res) => {
    console.log("Registrando usuario:");
    res.status(201).send({ status: "success", message: "Usuario creado con éxito." });
})

// Login
router.post('/login', passport.authenticate('login', { failureRedirect: 'api/session/fail-login' }), async (req, res) => {
    const user = req.user;
    console.log("User found to login: \n " + user);

    // if (email != 'adminCoder@coder.com' || password !== 'adminCod3r123') {
    if (user.email != 'adminCoder@coder.com') {
        req.session.email = user.email;
        req.session.admin = false;
    } else {
        req.session.email = user.email;
        req.session.admin = true;
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
})

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

export default router;

// // Usamos updateOne para actualizar el documento
// const result = await userModel.updateOne({ _id: userIdToUpdate }, { $set: userToUpdate });