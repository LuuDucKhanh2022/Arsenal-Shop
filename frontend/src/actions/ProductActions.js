import axios from "axios";
import {
  ADMIN_PRODUCT_FAIL,
  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  PRODUCT_CATEGORY_FAIL,
  PRODUCT_CATEGORY_REQUEST,
  PRODUCT_CATEGORY_SUCCESS,
  CLEAR_ERRORS,
  STOP_BUSINESS_FAIL,
  STOP_BUSINESS_REQUEST,
  STOP_BUSINESS_SUCCESS,
  DELETE_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  NEW_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  ALL_REVIEW_REQUEST,
  ALL_REVIEW_SUCCESS,
  ALL_REVIEW_FAIL,
} from "../constans/ProductConstans";

export const getProduct = (link) => async (dispatch) => {
  try {
    dispatch({
      type: ALL_PRODUCT_REQUEST,
    });
    const { data } = await axios.get(link);

    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: message,
    });
  }
};

export const getProductCategory = () => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_CATEGORY_REQUEST,
    });
    const { data } = await axios.get("/api/v2/productCategory");

    dispatch({
      type: PRODUCT_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: PRODUCT_CATEGORY_FAIL,
      payload: message,
    });
  }
};

// Get  Products Details
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v2/products/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: message,
    });
  }
};


// Create Product --------Admin
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(`/api/v2/products`, productData, config);

    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: message,
    });
  }
};

// Get Admin Products -----Admin
export const getAdminProduct = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCT_REQUEST });

    const { data } = await axios.get("/api/v2//admin/products");

    dispatch({
      type: ADMIN_PRODUCT_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: ADMIN_PRODUCT_FAIL,
      payload: message,
    });
  }
};

// Delete Product ------Admin
export const stopBusiness = (id) => async (dispatch) => {
  try {
    dispatch({ type: STOP_BUSINESS_REQUEST });

    const { data } = await axios.put(`/api/v2/products/${id}/state`);

    dispatch({
      type: STOP_BUSINESS_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: STOP_BUSINESS_FAIL,
      payload: message,
    });
  }
};

// Update Product
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.put(
      `/api/v2/products/${id}`,
      productData,
      config
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: message,
    });
  }
};

// Get All Reviews of a Product
export const getAllReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_REVIEW_REQUEST });

    const { data } = await axios.get(`/api/v2/reviews?id=${id}`);

    dispatch({
      type: ALL_REVIEW_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: ALL_REVIEW_FAIL,
      payload: message,
    });
  }
};

// Delete Review of a Product ------ Admin
export const deleteReviews = (reviewId, productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    const { data } = await axios.delete(
      `/api/v2/reviews?id=${reviewId}&productId=${productId}`
    );

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: message,
    });
  }
};

//   Clearing errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
