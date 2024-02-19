// Imports Services
import handlebars from "express-handlebars";
import express from "express";
import mongoose from "mongoose";
import passport from 'passport';
import session from "express-session";
import MongoStore from "connect-mongo";
import Handlebars from "handlebars";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import cors from 'cors';
// Imports Routes
import sessionsRouter from "./routes/loginAndRegister/sessions.router.js";
import usersViewRouter from "./routes/LoginAndRegister/users.views.router.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/restructuring/products.router.js";
import cartsRouter from "./routes/restructuring/carts.router.js";
import jwtRouter from './routes/restructuring/jwt.router.js'
import messagesRouter from "./routes/messages.router.js";
// Imports Managers
import productDao from "./daos/dbManager/product.dao.js";
import messageDao from "./daos/dbManager/message.dao.js";
import cartDao from "./daos/dbManager/cart.dao.js";
//Import Utilidades
import config from './config/config.js';
import initializePassport from './config/passport.config.js'
import MongoSingleton from './config/mongodb-singleton.js';
import { password, db_name, PORT } from "./env.js";
import __dirname from "./utils.js";
import { cookieExtractorEmail } from './utils.js'
const MONGO_URL = `mongodb+srv://enzozanino99:${password}@cluster99.u9fivzm.mongodb.net/${db_name}?retryWrites=true&w=majority`;

const app = express();

const SERVER_PORT = config.port;
const httpServer = app.listen(SERVER_PORT, () => {
	console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
    //DotEnv:
    //console.log(config);
});

const socketServer = new Server(httpServer);

let userEmailApp; //! una vez echa una conexion (login) se guarda el email de la conexion en userEmailApp

app.use(
	session({
		store: MongoStore.create({
			mongoUrl: MONGO_URL,
			ttl: 10 * 60,
		}),

		secret: "coderS3cr3t",
		resave: false, // guarda en memoria
		saveUninitialized: true, //lo guarda a penas se crea
	})
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.use(express.json());
//* express.json() analiza y hace accesibles los datos JSON en req.body.
app.use(express.urlencoded({ extended: true }));
//* express.urlencoded() analiza los datos codificados en URL y los hace accesibles en req.body,
//* con extended: true para permitir un análisis más complejo de esos datos. [arrays, o: {objetos: {anidados}}]

const corsOptions = {
    origin: 'http://127.0.0.1:5502',

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    allowedHeaders: 'Content-Type,Authorization',

    credentials: true,
};
app.use(cors(corsOptions));

app.engine(
	"hbs",
	handlebars.engine({
		extname: "hbs",
		defaultLayout: "main",
		handlebars: allowInsecurePrototypeAccess(Handlebars),
	})
);
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/messages", messagesRouter);
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/jwt", jwtRouter);

app.get("/getUserEmail", async (req, res) => {
    let userEmail; // Definir userEmail fuera del bloque try-catch
    try {
        userEmail = cookieExtractorEmail(req); // Llama a la función cookieExtractor para obtener el token de la cookie
        console.log("Email obtenido desde Cookie:", userEmail);
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error",
            error,
        });
        return; // Importante: Terminar la ejecución después de manejar el error
    }

    // Simulación: obtén el correo electrónico desde la sesión
    const EmailUsuario = userEmail;

    // Responde con el correo electrónico en formato JSON
    res.json({ email: EmailUsuario });
});

//TODO: MongoSingleton
const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        console.log(error);
    }
}
mongoInstance()

socketServer.on("connection", async (socketClient) => {
	
	socketClient.on("connectUser", async (email) => {
		console.log("Cliente Conectado a HOME: ", email);
		userEmailApp = email;
		socketClient.emit("home", {
			cart: await cartDao.getCartByUser(userEmailApp),
		});
	});

	socketClient.on("messageRTP", async (email) => {
		console.log("Cliente Conectado: ", email);
		userEmailApp = email;
		socketClient.emit("realTimeProducts", {
			products: await productDao.getAll(),
			cart: await cartDao.getCartByUser(userEmailApp),
		});
	});

	socketClient.on("addProduct", async (newProduct) => {
		await productDao.createProduct(newProduct);
		console.log("addProductRTProd")
		socketServer.emit("realTimeProducts", {
			products: await productDao.getAll(),
			cart: await cartDao.getCartByUser(userEmailApp),
		});
	});
	socketClient.on("filtrando", async (email) => {
		socketServer.emit("carroParaFiltro", {
			cart: await cartDao.getCartByUser(email),
		});
	});

	socketClient.on("editProduct", async ({ productId, editedProduct }) => {
		await productDao.updateProduct(productId, editedProduct);
		socketClient.emit("productDetails", {
			product: await productDao.getProductById(productId),
		});
		socketServer.emit("realTimeProducts", {
			products: await productDao.getAll(),
			cart: await cartDao.getCartByUser(userEmailApp),
		});
	});

	socketClient.on("deleteProduct", async (productId) => {
		await productDao.deleteProduct(productId);
		socketServer.emit("realTimeProducts", {
			products: await productDao.getAll(),
			cart: await cartDao.getCartByUser(userEmailApp),
		});
	});

	socketClient.on("userConnected", async (currentUserEmail) => {
		console.log("User connected:", currentUserEmail);
		socketClient.broadcast.emit("newUserConnected", currentUserEmail);

		try {
			const chatHistory = await obtenerHistorialDeChats();
			socketClient.emit("chatHistory", chatHistory);
		} catch (error) {
			console.log("Error al obtener el historial de chats:", error.message);
			socketClient.emit("chatHistory", []);
		}
	});
	async function obtenerHistorialDeChats() {
		try {
			const chatHistory = await messageDao.getAllMessages();
			return chatHistory;
		} catch (error) {
			console.log("Error al obtener el historial de chats:", error.message);
			return [];
		}
	}

	socketClient.on("sendChatMessage", async ({ email, message }) => {
		const newMessage = {
			email,
			message,
			date: new Date(),
		};
		await messageDao.createMessage(newMessage);
		socketServer.emit("newChatMessage", newMessage);
	});

	let userEmail = ""; //es aparte

	socketClient.on("userCartAuth", async (currentUserEmail) => {
		userEmail = currentUserEmail;
		const userCart = await cartDao.getCartByUser(userEmail);
		if (!userCart) {
			userCart = await cartDao.addToCart(userEmail, "", "");
		}
		const productsInfo = await Promise.all(
			userCart.products.map(async (product) => {
				const productInfo = await productDao.getProductById(product.productId);
				return {
					productId: product.productId,
					info: productInfo,
					quantity: product.quantity,
				};
			})
		);
		socketClient.emit("productsCartInfo", productsInfo);
	});
	socketClient.on("addToCart", async ({ productId, currentUserEmail }) => {
		await cartDao.addToCart(currentUserEmail, productId, 1);
		socketClient.emit("realTimeProducts", {
			products: await productDao.getAll(),
			cart: await cartDao.getCartByUser(currentUserEmail),
		});
	});

	socketClient.on("updateCart", async ({ productId, action }) => {
		userEmail = userEmail ? userEmail : userEmailApp;
		const userCart = await cartDao.getCartByUser(userEmail);
		if (userCart) {
			const productIndex = userCart.products.findIndex(
				(item) => item.productId._id.toString() === productId
			);
			if (productIndex !== -1) {
				const product = userCart.products[productIndex];
				switch (action) {
					case "add":
						product.quantity++;
						break;
					case "subtract":
						if (product.quantity > 1) {
							product.quantity--;
						}
						break;
					default:
						break;
				}
				await userCart.save();
				const productsInfo = await Promise.all(
					userCart.products.map(async (product) => {
						const productInfo = await productDao.getProductById(product.productId);
						return {
							productId: product.productId,
							info: productInfo,
							quantity: product.quantity,
						};
					})
				);
				socketClient.emit("productsCartInfo", productsInfo);
				socketClient.emit("realTimeProducts", {
					products: await productDao.getAll(),
					cart: await cartDao.getCartByUser(userEmail),
				});
			}
		}
	});

	socketClient.on("deleteFromCart", async ({ productId }) => {
		try {
			if (productId == null) {
				console.error("productId is null or undefined");
				return;
			}

			await cartDao.removeFromCart(userEmailApp, productId);

			const updatedCart = await cartDao.getCartByUser(userEmailApp);
			const productsInfo = await Promise.all(
				updatedCart.products.map(async (product) => {
					const productInfo = await productDao.getProductById(
						product.productId._id.toString()
					);
					return {
						productId: product.productId._id.toString(),
						info: productInfo,
						quantity: product.quantity,
					};
				})
			);

			socketClient.emit("productsCartInfo", productsInfo);
			socketClient.emit("realTimeProducts", {
				products: await productDao.getAll(),
				cart: updatedCart,
			});
		} catch (error) {
			console.error("Error handling deleteFromCart:", error.message);
		}
	});

	socketClient.on("clearCart", async () => {
		await cartDao.clearCart(userEmailApp);
		socketClient.emit("productsCartInfo", []);
	});
});

/*=============================================
=            connectMongoDB                   =
=============================================*/
// const connectMongoDB = async () => {
// 	try {
// 		await mongoose.connect(MONGO_URL);
// 		console.log("Conectado con exito a la DB usando Mongoose!!");
// 	} catch (error) {
// 		console.error("No se pudo conectar a la BD usando Moongose: " + error);
// 		process.exit();
// 	}
// };
// connectMongoDB();
