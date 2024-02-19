import productsDao from "../daos/dbManager/product.dao.js";

export const getProducts = async (limit, page, sort, query) => {
	return await productsDao.getAllProducts(limit, page, sort, query);
};

export const getProduct = async (pid) => {
	return await productsDao.getProductById(pid);
};

export const postProduct = async (product) => {
	return await productsDao.createProduct(product);
};

export const putProduct = async (pid, product) => {
	return await productsDao.updateProduct(pid, product);
};

export const deleteProduct = async (pid) => {
	return await productsDao.deleteProduct(pid);
};
