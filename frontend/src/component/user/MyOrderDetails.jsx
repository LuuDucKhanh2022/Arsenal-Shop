import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../more/Metadata";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { getOrderDetails, clearErrors } from "../../actions/OrderAction";
import { Country, State } from "country-state-city";
import { useAlert } from "react-alert";
import Loading from "../../more/Loader";
import Header from "../Home/Header";
import Footer from "../../Footer";
import { ToastContainer, toast } from "react-toastify";
import "./MyOrderDetails.css";
import Breadcrumbs from "../../more/Breadcrumbs";
import { useState } from "react";

const MyOrderDetails = ({ match }) => {
  const { order, error, loading } = useSelector(
    (state) => state.myOrderDetails
  );
  const [address, setAddress] = useState();
  useEffect(() => {
    let state, country;
    if (order && order.shippingInfo) {
      country = Country.getAllCountries().find(
        (item) => item.isoCode === order.shippingInfo.countryCode
      ).name;
      state = State.getStateByCodeAndCountry(
        order.shippingInfo.stateCode,
        order.shippingInfo.countryCode
      ).name;
      setAddress(`${order.shippingInfo.address}, ${state}, ${country}`);
    }
  }, [order]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, error, match.params.id]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title="Order Details" />
          <Header />
          <Breadcrumbs />
          <div className="orderDetailsPage">
            <Typography component="h1">Order #{order && order._id}</Typography>
            <div className="orderDetailsContainer">
              <Typography>Shipping Info</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Name:</p>
                  <span>{order.user && order.user.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>
                    {order.shippingInfo && order.shippingInfo.phoneNo}
                  </span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>
                    {address}
                  </span>
                </div>
              </div>
              <Typography>Payment</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order.orderStatus === "Delivered"
                        ? "greenColor"
                        : "redColor"
                    }
                  ></p>
                  <p
                    style={{
                      color: "green",
                    }}
                  >
                    PAID
                  </p>
                </div>

                <div>
                  <p>Amount:</p>
                  <span>$ {order.totalPrice && order.totalPrice}</span>
                </div>
              </div>

              <Typography>Order Status</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order.orderStatus && order.orderStatus === "Delivered"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {order.orderStatus && order.orderStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="orderDetailsCartItems">
              <Typography>Order Items:</Typography>
              <div className="orderDetailsCartItemsContainer">
                {order.orderItems &&
                  order.orderItems.map((item) => (
                    <div key={item.Offer}>
                      <img src={item.image} alt="Product" />
                      <Link to={`/product/${item.Offer}`}>
                        {item.name}
                        <div>
                          {item.size !== null ? `Size: ${item.size}` : ""}
                        </div>
                      </Link>{" "}
                      <span>
                        {item.quantity} X ${item.price} ={" "}
                        <b>${item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
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

export default MyOrderDetails;
