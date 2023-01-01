import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { deleteFavouriteItemsToCart } from "../../actions/FavouriteAction";
import "react-toastify/dist/ReactToastify.css";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/FavoriteBorder";
import { Link } from "react-router-dom";
import FavouriteItemsCard from "./FavouriteItemsCard.jsx";
import MetaData from "../../more/Metadata";
import Loading from "../../more/Loader";
import { useState } from "react";
import { useEffect } from "react";
import Header from "../Home/Header";
import "./Favourites.css";
import Footer from "../../Footer";
import Breadcrumbs from "../../more/Breadcrumbs";
import { toast } from "react-toastify";


const Favourite = ({ history }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.productDetails);
  const { favouriteItems } = useSelector((state) => state.favourite);
  // let favItems = favouriteItems;
  const [favItems, setFavItems] = useState([favouriteItems]);

  const deleteFavouriteItems = (id) => {
    dispatch(deleteFavouriteItemsToCart(id));
    toast.success("Delete product sucessfully!")
  };

  useEffect(() => {
    let favItemList = favouriteItems;
    favItemList.forEach(async (item) => {
      const { data } = await axios.get(`/api/v2/products/${item.id}`);
      item.sizeList = data.product.size;
      item.stock = data.product.stock;
    });
    setFavItems(favItemList);
    // dispatch(updateFavouriteStock(favouriteItems));
  }, [favItems, favouriteItems]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title="Favourites Items" />
          <Header/>
          <Breadcrumbs />
          {favItems.length === 0 ? (
            <div className="emptyCart">
              <RemoveShoppingCartIcon />
              <Typography>No Items In Favourites</Typography>
              <Link to="/products">View Products</Link>
            </div>
          ) : (
            <>
              <div className="favouritesPage">
                <div className="favouritesHeader">
                  <div className="favouritesHeader__product">Product</div>
                  {/* <p>Price</p> */}
                  <div className="favouritesHeader__size">Size</div>
                  <div className="favouritesHeader__action">Action</div>
                </div>
                {favItems &&
                  favItems.map((item) => (
                    <div className="favouritesContainer" key={item.id}>
                      <FavouriteItemsCard
                        item={item}
                        deleteFavouriteItems={deleteFavouriteItems}
                      />
                    </div>
                  ))}
              </div>
            </>
          )}
          <Footer/>
        </>
      )}
    </>
  );
};

export default Favourite;
