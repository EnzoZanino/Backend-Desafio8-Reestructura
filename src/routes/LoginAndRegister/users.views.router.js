import { Router } from "express";
import { cookieExtractorEmail } from "../../utils.js";

import UserDao from "../../daos/dbManager/user.dao.js";
const newUserDao = new UserDao();

const router = Router();

router.get("/login", (req, res) => {
	res.render("login");
});

router.get("/register", (req, res) => {
	res.render("register");
});

router.get("/", async (req, res) => {
	let userEmailCookie = undefined;
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
	let userCookie = await newUserDao.getUserByEmail(userEmailCookie);
	res.render("profile", {
		title: "User Profile",
		user: userCookie,
	});
});

router.post("/logout", (req, res) => {
	res.clearCookie("jwtCookieToken");
	req.session.destroy((error) => {
		if (error) {
			res.json({ error: "Error logout", msg: "Error logging out" });
		}
		res.send("Session cerrada correctamente!");
	});
});

export default router;
