import {
	getCarts,
	getCart,
	addToCart,
	updateCart,
	updateProductQuantity,
	removeFromCart,
	clearCart,
} from "../services/cartsServices.js";

export const getCartsController = async (req, res) => {
	try {
		let carts = await getCarts();
		res.json(carts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getCartController = async (req, res) => {
	try {
        const cartId = req.params.cid;
        const cart = await getCart(cartId);

        if (!cart || cart === '') return res.json({ message: "Cart not found" });

        res.json({ cart });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const postCartController = async (req, res) => {
	try {
        const userId = req.body.userId;
        const response = await getCart(userId);
        res.json({ message: "Ok", response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const addToCartController = async (req, res) => {
	try {
        const userId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const response = await addToCart(userId, productId, quantity);
        if (response.modifiedCount === 0) {
            return res.json({ error: "Cart not updated" });
        }

        res.json({ response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updateCartController = async (req, res) => {
	try {
        const { cid } = req.params;
        const newProducts = req.body.products;
        await updateCart(cid, newProducts);
        res.json({ status: "success", message: "Cart updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const updateProductQuantityCartController = async (req, res) => {
	try {
        const { cid, pid } = req.params;
        const newQuantity = req.body.quantity;
        await updateProductQuantity(cid, pid, newQuantity);
        res.json({ status: "success", message: "Product quantity updated in the cart" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const deleteFromCartController = async (req, res) => {
	try {
		const { cid, pid } = req.params;
		await removeFromCart(cid, pid);
		res.json({ status: "success", message: "Product removed from the cart" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const clearCartController = async (req, res) => {
	try {
		const cartId = req.params.cid;
		const response = await clearCart(cartId);
		if (!response) {
			return res.json({ error: "Cart not found" });
		}
		res.json({ response });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
