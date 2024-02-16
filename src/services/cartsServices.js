import cartDao from "../daos/dbManager/cart.dao.js"

export const getCarts = async () => {
	return await cartDao.getAllCarts();
};

export const getCart = async (userId) => {
	return await cartDao.getCartByUser(userId);
};

export const addToCart = async (userId, productId, quantity) => {
	return await cartDao.addProductToCart(userId, productId, quantity);
};

export const updateCart = async (cid, newProducts) => {
	return await cartDao.updateCart(cid, newProducts);
};

export const updateProductQuantity = async (cid, pid, newQuantity) => {
	return await cartDao.updateProductQuantity(cid, pid, newQuantity);
};

export const removeFromCart = async (cid, pid) => {
	return await cartDao.deleteProductFromCart(cid, pid);
};

export const clearCart = async (cartId) => {
	return await cartDao.deleteCart(cartId);
};
