import {
  ADD_TO_FAVOURITE,
  REMOVE_FROM_FAVOURITE,
} from "../constans/FavouriteConstans";
import axios from "axios";
import { UPDATE_FAVOURITE_STOCK } from "../constans/CartConstans";

// Add to favourites
export const addToFavourite =
  (id, quantity, selectedSize = "") =>
  async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v2/products/${id}`);

    dispatch({
      type: ADD_TO_FAVOURITE,
      payload: {
        id: data.product._id,
        name: data.product.name,
        category: data.product.category.name,
        subCategory: data.product.subCategory.name,
        price: data.product.price,
        image: data.product.images[0].url,
        sizeList: data.product.size,
        size: selectedSize === "" ? null : selectedSize.name,
        stock: selectedSize === "" ? data.product.stock : selectedSize.stock,
        quantity,
      },
    });

    localStorage.setItem(
      "favouriteItems",
      JSON.stringify(getState().favourite.favouriteItems)
    );
  };

export const updateFavouriteStock = (favouriteItems) => async(dispatch,getState) => {
    favouriteItems = favouriteItems.map( async(item) => {
        const { product } = await axios.get(`/api/v2/products/${item.id}`);
        if(item.sizeList.length > 0 ) {
            item.sizeList = product.size;
        }
         item.stock = product.stock;
         return item;
    });
    dispatch({
        type: UPDATE_FAVOURITE_STOCK,
        payload :favouriteItems
    });
    localStorage.setItem(
        "favouriteItems",
        JSON.stringify(getState().favourite.favouriteItems)
      );
}
// Delete from favourites
export const deleteFavouriteItemsToCart =
  (id) => async (dispatch, getState) => {
    dispatch({
      type: REMOVE_FROM_FAVOURITE,
      payload: id,
    });

    localStorage.setItem(
      "favouriteItems",
      JSON.stringify(getState().favourite.favouriteItems)
    );
  };
