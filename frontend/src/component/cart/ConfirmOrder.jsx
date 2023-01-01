import React from "react";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { Country, State } from "country-state-city";
import MetaData from "../../more/Metadata";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import "./ConfirmOrder.css";
import Header from "../Home/Header";

const ConfirmOrder = ({ history }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  let productPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const subtotal = productPrice;
  // eslint-disable-next-line
  const shippingCharges = productPrice > 99 ? 0 : 50;
  const totalPrice = subtotal + shippingCharges;
  const country = Country.getAllCountries().find(
    (item) => item.isoCode === user.countryCode
  ).name;
  const state = State.getStateByCodeAndCountry(user.stateCode,user.countryCode).name;
  const shippingAddress = `${user.address}, ${state}, ${country}`;
  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    history.push("/process/payment");
  };

  return (
    <>
      <MetaData title="Confirm Order" />
      <Header />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{user.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{shippingAddress}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>

            {cartItems.length === 0 ? (
              <div className="confirmCartItemsContainer">""</div>
            ) : (
              <div className="confirmCartItemsContainer">
                {cartItems &&
                  cartItems.map((item) => (
                    <div key={`${item.product}${item.size}`}>
                      <img src={item.image} alt="Product" />
                      <Link to={`/product/${item.product}`}>
                        {item.name}
                        <div>
                          {item.size !== null ? `Size : ${item.size}` : ""}
                        </div>
                      </Link>{" "}
                      <span>
                        {item.quantity} X ${item.price} ={" "}
                        <b>${item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summery</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>${subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>${shippingCharges}</span>
              </div>
              <div></div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>${totalPrice}</span>
            </div>

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
