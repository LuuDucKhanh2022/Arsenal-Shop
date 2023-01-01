import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./Success.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import Header from "../Home/Header";
import Footer from "../../Footer";

const Success = () => {
  return (
    <>
      <Header />
      <div className="orderSuccess">
        <CheckCircleIcon />
        <Typography>Your Order has been Placed successfully </Typography>
        <Link to="/orders">View Orders</Link>
      </div>
      <Footer />
    </>
  );
};

export default Success;
