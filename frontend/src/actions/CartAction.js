import {
    ADD_TO_CART,
    EMPTY_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO,
  } from "../constans/CartConstans";
  import axios from "axios";
  
  // Add to Cart ---Product
  export const addItemsToCart = (id, quantity=1,selectedSize = '') => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v2/products/${id}`);

    dispatch({
      type: ADD_TO_CART,
      payload: {
        id: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        size: selectedSize === '' ? null : selectedSize.name,
        stock: selectedSize === '' ? data.product.stock : selectedSize.stock,
        quantity,
      },
    });
  
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };

  // REMOVE FROM CART ---Product
  export const removeItemsFromCart = (id,size) => async (dispatch, getState) => {
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: {
        id,
        size
      },
    });
  
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };

  export const emptyCard = () => async (dispatch) => {
    dispatch( {
      type: EMPTY_CART,
    });
    localStorage.setItem("cartItems", JSON.stringify([]));

  }


  // SAVE SHIPPING INFO 
  export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
      type: SAVE_SHIPPING_INFO,
      payload: data,
    });
  
    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };