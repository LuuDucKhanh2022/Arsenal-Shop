import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FavouriteItemsCard.css";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart } from "../../actions/CartAction";
import { ToastContainer, toast } from "react-toastify";
const FavouriteItemsCard = ({ item, deleteFavouriteItems }) => {
  const dispatch = useDispatch();
  const [chooseSize, setChooseSize] = useState({});
  // let chooseSize = {};
  const handleChooseSize = (e) => {
    if (e.target.value !== "") {
      setChooseSize(item.sizeList.find((size) => size.name === e.target.value));
    }
  };
  const addToCard = () => {
    if (item.sizeList.length === 0) {
      dispatch(addItemsToCart(item.id));
    } else {
      const myJson = JSON.stringify(chooseSize);
      if (myJson === "{}") {
        return toast.error("Please choose a size!");
      }
      dispatch(addItemsToCart(item.id, 1, chooseSize));
    }
  };

  return (
    <>
      <div className="favouriteItemCard">
        <Link
          to={`/products/${item.category}/${item.subCategory}/${item.id}`}
          className="product"
        >
          <img src={item.image} alt="product img" />
          <div className="name">{item.name}</div>
          <div className="price">{`$${item.price}`}</div>
        </Link>
        {item.sizeList && (
          <div className="size">
            {item.sizeList.length <= 0 ? (
              "No size!"
            ) : (
              <select
                onChange={(e) => handleChooseSize(e)}
                value={chooseSize.name === undefined ? "" : chooseSize.name}
                name=""
                id=""
              >
                <option value="">Choose size</option>
                {item.sizeList.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >{`${item.name}(${item.stock} left)`}</option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="action">
          {item.stock <= 0 ? (
            <div>Out off stock</div>
          ) : (
            <div>
              <button
                style={{ backgroundColor: "#3BB77E" }}
                onClick={() => addToCard()}
              >
                Add to card
              </button>
            </div>
          )}
          <div>
            <button
              style={{ backgroundColor: "var(--main-color" }}
              onClick={() => deleteFavouriteItems(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
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
    // <div className="FavouriteItemsCard">
    //   <div>
    //     <img src={item.image} alt="ssa" />
    //     <p onClick={() => deleteFavouriteItems(item.product)}>Remove</p>
    //     <Link
    //       to={`/product/${item.product}`}
    //       style={{
    //         fontSize: "300 0.9vmax",
    //         fontFamily: "cursive",
    //       }}
    //     >
    //       {item.name}
    //     </Link>
    //   </div>

    //   <div>
    //     <span>{`$ ${item.price}`}</span>
    //   </div>

    //   <div>
    //     <p style={{ paddingBottom: ".5vmax" }}>
    //       <b className={product.stock < 1 ? "redColor" : "greenColor"}>
    //         {product.stock < 1 ? "OutOfStock" : "InStock"}
    //       </b>
    //     </p>
    //   </div>

    //   <div>
    //     <Link to={`/product/${item.product}`}>
    //       <button
    //         className="favouritesButton"
    //         onClick={() => deleteFavouriteItems(item.product)}
    //       >
    //         Add To Cart
    //       </button>
    //     </Link>
    //   </div>
    // </div>
  );
};

export default FavouriteItemsCard;
