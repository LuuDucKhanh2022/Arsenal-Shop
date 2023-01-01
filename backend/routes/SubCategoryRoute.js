const express = require("express");
const { createSubCategory, getSubCategory,getAllSubCategories, updateSubCategory, stopBusinessSubCategory} = require ("../controller/SubCategoryController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router
  .route("/subcategories")
  .get(getAllSubCategories)
  .post(isAuthenticatedUser,authorizeRoles("admin","root"),createSubCategory);
router
  .route("/subcategories/:id")
  .get(isAuthenticatedUser,authorizeRoles("admin","root"),getSubCategory)
  .put(isAuthenticatedUser,authorizeRoles("admin","root"),updateSubCategory);
router
  .route("/subcategories/:id/state")
  .put(isAuthenticatedUser,authorizeRoles("admin","root"),stopBusinessSubCategory)
 module.exports = router;