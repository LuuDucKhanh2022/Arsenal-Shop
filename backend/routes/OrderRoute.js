const express = require("express");
const { createOrder, getSingleOrder, getAllAdminOrders, getAllOrders, updateOrderStatus, deleteOrder } = require("../controller/OrderController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router
    .route("/orders")
    .post(isAuthenticatedUser,createOrder)
    .get(isAuthenticatedUser,authorizeRoles("admin","root"),getAllAdminOrders);

router.route("/orders/me").get(isAuthenticatedUser,getAllOrders);

router
    .route("/orders/:id")
    .get(isAuthenticatedUser,getSingleOrder)
    .put(isAuthenticatedUser,authorizeRoles("admin","root"),updateOrderStatus)
    .delete(isAuthenticatedUser,authorizeRoles("admin","root"),deleteOrder);


module.exports = router;