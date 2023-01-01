const express = require("express");
const {
  getAllProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  updateProductImg,
  deleteProduct,
  getSingleProduct,
  createProductReview,
  getSingleProductReviews,
  deleteReview,
  getProductCategory,
  stopBusiness,
} = require("../controller/ProductController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin","root"), getAdminProducts);
router
  .route("/products")
  .get(getAllProducts)
  .post(isAuthenticatedUser,authorizeRoles("admin","root"),createProduct);
router
  .route("/products/:id")
  .get(getSingleProduct)
  .put(isAuthenticatedUser,authorizeRoles("admin","root"),updateProduct)
  .delete(isAuthenticatedUser,authorizeRoles("admin","root"),deleteProduct);
router
  .route("/products/:id/img")
  .get(getSingleProduct)
  .put(isAuthenticatedUser,authorizeRoles("admin","root"),updateProductImg)
  .delete(isAuthenticatedUser,authorizeRoles("admin","root"),deleteProduct);
router
  .route("/products/:id/state")
  .put(isAuthenticatedUser,authorizeRoles("admin","root"),stopBusiness)
router
  .route("/product/review")
  .post(isAuthenticatedUser,createProductReview);

router
  .route("/reviews")
  .get(getSingleProductReviews)
  .delete(isAuthenticatedUser, authorizeRoles("admin","root"), deleteReview);
router
  .route("/productCategory")
  .get(getProductCategory);
module.exports = router;
