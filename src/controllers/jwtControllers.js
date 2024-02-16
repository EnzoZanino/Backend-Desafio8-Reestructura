import userModel from "../models/user.model.js";
import { isValidPassword, generateJWToken } from '../utils.js';

export const githubRegister = async (req, res) => {};

export const githubCallback = async (req, res) => {
	const user = req.user;
	const tokenUser = {
		name: `${user.first_name} ${user.last_name}`,
		email: user.email,
		age: user.age,
		role: user.role,
		id: user._id,
	};
	const access_token = generateJWToken(tokenUser);
	console.log(access_token);

	res.cookie("jwtCookieToken", access_token, {
		maxAge: 600000,
		httpOnly: true,
	});
	res.redirect("/products");
};

export const register = async (req, res) => {
    console.log("Registrando usuario:");
    res.status(201).send({ status: "success", message: "Usuario creado con extito." });
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
        const user = await userModel.findOne({ email: email });
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("Usuario no encontrado con el email: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con el email: " + email });
        }
        if (!isValidPassword(user, password)) {
            console.warn("Credenciales invalidas: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            // cart: user.cart,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);

        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 60000,
                httpOnly: true //No se expone la cookie
            }
        )
        res.send({ message: "Login success!!" })
	} catch (error) {
		console.error(error);
		return res.status(500).send({ status: "error", error: "Intern app error" });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("jwtCookieToken");
	res.redirect("/users/login");
};
