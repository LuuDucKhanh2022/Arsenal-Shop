import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addItemsToCart, removeItemsFromCart } from "../../actions/CartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import CartItemCard from "./CartItemCard.js";
import Header from "../Home/Header";
import Footer from "../../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Cart.css";
import Breadcrumbs from "../../more/Breadcrumbs";

const Cart = ({ history }) => {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const [cart, setCart] = useState([cartItems]);

  let Price = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  let totalPrice = Price;

  const increaseQuantity = (id, quantity, size, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return toast.error("Product Stock Limited");
    }
    if (size === null) {
      dispatch(addItemsToCart(id, newQty));
    } else {
      const selectedSize = { name: size, stock };
      dispatch(addItemsToCart(id, newQty, selectedSize));
    }
  };

  const decreaseQuantity = (id, quantity, size, stock) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    if (size === null) {
      dispatch(addItemsToCart(id, newQty));
    } else {
      const selectedSize = { name: size, stock };
      dispatch(addItemsToCart(id, newQty, selectedSize));
    }
  };

  const deleteCartItems = (id, size) => {
    dispatch(removeItemsFromCart(id, size));
  };

  const checkoutHandler = () => {
    // history.push("/login?redirect=shipping");

    if (isAuthenticated) {
      history.push("/shipping");
    } else {
      history.push("/login");
    }
  };

  useEffect(() => {
    let cartList = cartItems;
    cartList.forEach(async (item) => {
      const { data } = await axios.get(`/api/v2/products/${item.id}`);
      if (item.size !== null) {
        for (let i = 0; i < data.product.size.length; i++) {
          if (data.product.size[i].name === item.size) {
            item.stock = data.product.size.stock;
            break;
          }
        }
      } else {
        item.stock = data.product.stock;
      }
    });
    setCart(cartList);
    // dispatch(updateFavouriteStock(cartItems));
  }, [cart, cartItems]);

  return (
    <>
      {cart.length === 0 ? (
        <>
          <Header />
          <div className="emptyCart">
            <RemoveShoppingCartIcon />
            <Typography>No Items In Cart</Typography>
            <Link to="/products">View Products</Link>
          </div>
          <Footer />
        </>
      ) : (
        <>
          <Header />
          <Breadcrumbs />
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

            {cart &&
              cart.map((item) => (
                <div className="cartContainer" key={`${item.id}${item.size}`}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className="cartInput">
                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id,
                          item.quantity,
                          item.size,
                          item.stock
                        )
                      }
                    >
                      -
                    </button>
                    <input type="number" readOnly value={item.quantity} />
                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id,
                          item.quantity,
                          item.size,
                          item.stock
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="cartSubtotal">{`$${
                    item.price * item.quantity
                  }`}</p>
                </div>
              ))}

            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Price Total</p>
                <p>$ {totalPrice}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
          <Footer />
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </>
      )}
    </>
  );
};

export default Cart;
