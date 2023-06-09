const { Router } = require("express");
const Products = require("../../models/Products.model");
const Cart = require("../../models/Carts.model");
const router = Router();
const privateAccess = require("../../middlewares/privateAccess.middleware");
const productSearch = require("../products.dao");
const adminAccess = require("../../middlewares/adminAcces.middleware");
const userAcces = require("../../middlewares/userAcces.middleware");
const ProductsRepository = require("../repository/products.repository");

router.get("/", privateAccess, async (req, res, next) => {
  try {
    const user = req.session.user;
    const message = user
      ? `Bienvenido ${user.role} ${user.first_name} ${user.last_name}!`
      : null;
    const cart = await Cart.findOne({ _id: user.cartId });
    const cartId = cart._id.toString();
    const products = await productSearch(req, message, cartId);
    res.render("products.handlebars", products);
  } catch (error) {
    next(error);
  }
});

router.get("/mockingProducts", userAcces, async (req, res, next) => {
  try {
    const productsRepository = new ProductsRepository();
    const mockProducts = await productsRepository.generateMockProducts();
    res.json({ Productos: mockProducts });
  } catch (error) {
    next(error);
  }
});

router.post("/", adminAccess, async (req, res, next) => {
  try {
    const newProduct = await Products.create(req.body);
    res.json({ message: newProduct });
  } catch (error) {
    next(error);
  }
});

router.put("/:productId", adminAccess, async (req, res, next) => {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:productId", adminAccess, async (req, res, next) => {
  try {
    await Products.findByIdAndDelete(req.params.productId);
    res.json({
      message: `Product with ID ${req.params.productId} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
