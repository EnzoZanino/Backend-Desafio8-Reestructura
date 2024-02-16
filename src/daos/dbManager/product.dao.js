import { productModel } from "../../models/product.model.js";

class productDao {
	constructor() {
		this.model = productModel;
	}

	async getAllProducts(limit, page, sort, query) {
		try {
			const options = {
				limit: parseInt(limit, 10) || 10,
				page: parseInt(page, 10) || 1,
				sort: sort === "asc" ? "price" : sort === "desc" ? "-price" : "-createdAt",
			};

			const filter = query ? { $text: { $search: query } } : {};
			const result = await productDao.model.paginate(filter, options);
			const response = {
				status: "success",
				payload: result.docs,
				totalPages: result.totalPages,
				prevPage: result.prevPage,
				nextPage: result.nextPage,
				page: result.page,
				hasPrevPage: result.hasPrevPage,
				hasNextPage: result.hasNextPage,
				prevLink: result.hasPrevPage
					? `/api/products/?limit=${options.limit}&page=${result.prevPage}&sort=${options.sort}`
					: null,
				nextLink: result.hasNextPage
					? `/api/products/?limit=${options.limit}&page=${result.nextPage}&sort=${options.sort}`
					: null,
			};

			return response;
		} catch (error) {
			throw new Error("Error fetching products: " + error.message);
		}
	}

	async getProductById(id) {
		let product = await productModel.findById(id);
		if (!product) {
			throw new Error("Product not found");
		} else {
			return product;
		}
	}

	async createProduct(product) {
		return await this.model.create(product);
	}

	async updateProduct(id, product) {
		return await this.model.findByIdAndUpdate(id, product);
	}

	async deleteProduct(id) {
		return await this.model.findByIdAndDelete(id);
	}
}

export default new productDao();
