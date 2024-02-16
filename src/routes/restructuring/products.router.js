import { Router } from "express";
import {
	getProductsController,
	getProductController,
	postProductController,
	updateProductController,
	deleteProductController,
} from "../../controllers/productsControllers.js";

const ProductRouter = Router();

//Get products
ProductRouter.get("/", getProductsController);

//Get product
ProductRouter.get("/:pid", getProductController);

//Post product
ProductRouter.post("/", postProductController);

//Put product
ProductRouter.put("/:pid", updateProductController);

//Delete product
ProductRouter.delete("/:pid", deleteProductController);

export default ProductRouter;
