import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddIcon from "@material-ui/icons/Add";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import LocalOffer from "@material-ui/icons/LocalOffer";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import RateReviewIcon from "@material-ui/icons/RateReview";

const Sidebar = () => {
  const button = () => {
    let items = document.querySelectorAll(".Dashboard__item");
  };

  return (
    <div className="sidebar">
      <Link to="/">
        <img
          src="https://arsenaldirect.arsenal.com/_ui/responsive/theme-blue/images/arsenal-crest-logo.svg"
          alt="Ecommerce"
        />
      </Link>
      <Link to="/dashboard">
        <p className="Dashboard__item" onClick={button}>
          <DashboardIcon /> Dashboard
        </p>
      </Link>
      <Link to="/admin/products">
        <p className="Dashboard__item">
          <PostAddIcon /> All Products
        </p>
      </Link>

      <Link to="/admin/categories">
        <p>
          <AccountTreeIcon />
          Categories
        </p>
      </Link>
      <Link to="/admin/subcategories">
        <p>
          <AccountTreeIcon />
          Subcategories
        </p>
      </Link>

      <Link to="/admin/orders">
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <PeopleIcon /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <RateReviewIcon />
          Reviews
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;
