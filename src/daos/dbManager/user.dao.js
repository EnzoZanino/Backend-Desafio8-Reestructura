import userModel from "../../models/user.model.js";
// import { isValidPassword } from "../../utils.js";

class UserDao {
	async getUserByEmail(email) {
		try {
			const user = await userModel.findOne({ email: email });
			return user;
		} catch (error) {
			throw new Error(
				"Error al obtener usuario por correo electrónico: " + error.message
			);
		}
	}

	async getUserByID(id) {
		try {
			const userID = (await userModel.findOne([{ _id: id }])) || null;
			if (userID) {
				console.log(userID);
				return user;
			}

			return true;
		} catch (error) {
			return false;
		}
	}

	async restorePassword(user, pass) {
		try {
			const userLogged =
				(await userModel.updateOne({ email: user }, { password: pass })) || null;
			if (userLogged) {
				console.log("Contraseña restablecida.");
				return userLogged;
			}
			return false;
		} catch (error) {
			return false;
		}
	}

	async deleteUser(userId) {
		try {
			const user = await userModel.findByIdAndDelete(userId);
			if (!user) {
				return { message: "User not found with ID: " + userId };
			}
			return { message: "User deleted" };
		} catch (error) {
			console.error("Error deleting user with ID: " + userId);
		}
	}
}

export default UserDao;
