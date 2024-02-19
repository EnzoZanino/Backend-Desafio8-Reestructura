import { Router } from "express";
import {
	getAllProductsController,
	getProductController,
	postProductController,
	updateProductController,
	deleteProductController,
} from "../../controllers/productsControllers.js";

const ProductRouter = Router();

//Get products
ProductRouter.get("/", getAllProductsController);

//Get product
ProductRouter.get("/:pid", getProductController);

//Post product
ProductRouter.post("/", postProductController);

//Put product
ProductRouter.put("/:pid", updateProductController);

//Delete product
ProductRouter.delete("/:pid", deleteProductController);

export default ProductRouter;
