const express = require("express");
const {
  createUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  confirmEmail,
  resendLink,
} = require("../controller/UserController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/registration").post(createUser);

router.route("/confirmation/:email/:token").get(confirmEmail);

router.route("/confirmation/resendlink").post(resendLink)

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/me/password").put(isAuthenticatedUser, updatePassword);

router.route("/me/profile").put(isAuthenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin","root"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin","root"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin","root"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin","root"), deleteUser)

module.exports = router;
