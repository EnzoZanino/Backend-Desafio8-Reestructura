import { Router } from "express";
import productDao from "../daos/dbManager/product.dao.js";

import { cookieExtractorEmail } from "../utils.js";
import UserDao from "../daos/dbManager/user.dao.js";

const newUserDao = new UserDao();

const router = Router();

let userEmailCookie = undefined;
let userCookie = undefined;
let roleJWT = {
	role: undefined,
	isUser: undefined,
	isAdmin: undefined,
	isPremium: undefined,
};

router.get("/", async (req, res) => {
	const token = req.cookies["jwtCookieToken"];
	if (!token) {
		res.redirect("/users/login");
		return; // Importante: Terminar la ejecución después de redirigir
	}
	// let userEmail = null
	if (req && req.cookies) {
		userEmailCookie = cookieExtractorEmail(req);
		// console.log("email en ruta: " + userEmail)
	} else {
	}
	userCookie = await newUserDao.getUserByEmail(userEmailCookie);

	roleJWT.role = await userCookie.role;
	if (roleJWT.role === "admin") {
		roleJWT.isAdmin = true;
		roleJWT.isUser = false;
		roleJWT.isPremium = false;
	} else if (roleJWT.role === "user") {
		roleJWT.isAdmin = false;
		roleJWT.isUser = true;
		roleJWT.isPremium = false;
	} else if (roleJWT.role === "premium") {
		roleJWT.isAdmin = false;
		roleJWT.isUser = false;
		roleJWT.isPremium = true;
	}

	console.log(roleJWT);

	try {
		const products = await productDao.getAll();
		res.render("home", {
			user: userCookie.first_name,
			role: roleJWT,
			products,
		});
	} catch (error) {
		console.log(error);
		res.json({
			message: "Error",
			error,
		});
	}
});

router.get("/realtimeproducts", (req, res) => {
	const token = req.cookies["jwtCookieToken"];
	if (!token) {
		res.redirect("/users/login");
		return; // Importante: Terminar la ejecución después de redirigir
	}
	res.render("realTimeProducts", {
		user: userCookie.first_name,
		title: "realTimeProducts",
		email: userCookie.email,
	});
});

router.get("/chat", (req, res) => {
	const token = req.cookies["jwtCookieToken"];
	if (!token) {
		res.redirect("/users/login");
		return; // Importante: Terminar la ejecución después de redirigir
	}
	res.render("chat", {
		title: "Chat",
		user: userCookie.first_name,
	});
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.get("/logout", (req, res) => {
	// Para borrar una cookie, simplemente utiliza el método clearCookie
	res.clearCookie("jwtCookieToken");

	// Luego, redirige al usuario a la página de inicio de sesión u otra página que desees
	res.redirect("/users/login");
});

// Middleare auth
function auth(req, res, next) {
	if (req.session.email == "adminCoder@coder.com" && req.session.admin) {
		return next();
	} else {
		return res
			.status(403)
			.send("Usuario no autorizado para ingresar a este recurso.");
	}
}


router.get("/cart", (req, res) => {
	const token = req.cookies["jwtCookieToken"];
	if (!token) {
		res.redirect("/users/login");
		return; // Importante: Terminar la ejecución después de redirigir
	}
	res.render("cart", {
		title: "Cart Ecommerce",
		user: userCookie.first_name,
	});
});

router.get("/realTimeProducts/:pid", async (req, res) => {
	try {
		const productId = req.params.pid;
		const product = await productDao.getProductById(productId);

		if (!product || product == "")
			return res.json({ message: "Product not found" });

		res.render("productDetails", { product });
	} catch (error) {
		console.log(error);
		res.json({
			message: "Error",
			error,
		});
	}
});

export default router;
