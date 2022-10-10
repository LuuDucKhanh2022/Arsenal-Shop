const express = require("express");
const { createOrder, getSingleOrder, getAllAdminOrders, getAllOrders, updateOrderStatus, deleteOrder } = require("../controller/OrderController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router
    .route("/orders")
    .post(isAuthenticatedUser,createOrder)
    .get(isAuthenticatedUser,authorizeRoles("admin"),getAllAdminOrders);

router.route("/orders/me").get(isAuthenticatedUser,getAllOrders);

router
    .route("/orders/:id")
    .get(isAuthenticatedUser,getSingleOrder)
    .put(isAuthenticatedUser,authorizeRoles("admin"),updateOrderStatus)
    .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder);


module.exports = router;