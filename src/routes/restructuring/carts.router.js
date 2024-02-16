import { Router } from "express";
import { getCartsController, getCartController,	postCartController,
	addToCartController, updateCartController, updateProductQuantityCartController,
	clearCartController, deleteFromCartController, } from "../../controllers/cartsControllers.js";

const CartsRouter = Router();

//Get carts
CartsRouter.get("/", getCartsController);

//Get carts
CartsRouter.get("/:cid", getCartController);

//Post cart
CartsRouter.post("/", postCartController);

//post product in cart
CartsRouter.post("/:cid/product/:pid", addToCartController);

//put products in cart
CartsRouter.put("/:cid", updateCartController);

//put product quantity in  cart
CartsRouter.put("/:cid/products/:pid", updateProductQuantityCartController);

//delete product from cart
CartsRouter.delete("/:cid/products/:pid", deleteFromCartController);

//delete cart
CartsRouter.delete("/:cid", clearCartController);

export default CartsRouter
