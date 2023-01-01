const express = require("express");
const { createCategory, getAllCategories, getCategoryDetails, updateCategory, stopBusinessCategory} = require ("../controller/CategoryController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router
  .route("/categories")
  .get(getAllCategories)
  .post(isAuthenticatedUser,authorizeRoles("admin","root"),createCategory);
router
  .route("/categories/:id")
  .get(getCategoryDetails)
  .put(updateCategory,isAuthenticatedUser,authorizeRoles("admin","root"));
router
  .route("/categories/:id/state")
  .put(isAuthenticatedUser,authorizeRoles("admin","root"),stopBusinessCategory)  
 module.exports = router;