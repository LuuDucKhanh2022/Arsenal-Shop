import axios from "axios";
import {
  ALL_CATEGORY_FAIL,
  ALL_CATEGORY_REQUEST,
  ALL_CATEGORY_SUCCESS,
  NEW_CATEGORY_FAIL,
  NEW_CATEGORY_REQUEST,
  NEW_CATEGORY_SUCCESS,
  CLEAR_ERRORS,
  STOP_BUSINESS_CATEGORY_REQUEST,
  STOP_BUSINESS_CATEGORY_SUCCESS,
  STOP_BUSINESS_CATEGORY_FAIL,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CATEGORY_DETAILS_FAIL,
} from "../constans/CategoryConstans";
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({
      type: ALL_CATEGORY_REQUEST,
    });
    const { data } = await axios.get("/api/v2/categories");

    dispatch({
      type: ALL_CATEGORY_SUCCESS,
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
      type: ALL_CATEGORY_FAIL,
      payload: message,
    });
  }
};

// Get  Products Details
export const getCategoryDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v2/categories/${id}`);

    dispatch({
      type: CATEGORY_DETAILS_SUCCESS,
      payload: data.category,
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
      type: CATEGORY_DETAILS_FAIL,
      payload: message,
    });
  }
};

export const updateCategory = (id, categoryData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.put(
      `/api/v2/categories/${id}`,
      categoryData,
      config
    );

    dispatch({
      type: UPDATE_CATEGORY_SUCCESS,
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
      type: UPDATE_CATEGORY_FAIL,
      payload: message,
    });
  }
};

export const createCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_CATEGORY_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      `/api/v2/categories`,
      categoryData,
      config
    );

    dispatch({
      type: NEW_CATEGORY_SUCCESS,
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
      type: NEW_CATEGORY_FAIL,
      payload: message,
    });
  }
};

export const stopBusinessCategory = (id) => async (dispatch) => {
  try {
    dispatch({ type: STOP_BUSINESS_CATEGORY_REQUEST });

    const { data } = await axios.put(`/api/v2/categories/${id}/state`);

    dispatch({
      type: STOP_BUSINESS_CATEGORY_SUCCESS,
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
      type: STOP_BUSINESS_CATEGORY_FAIL,
      payload: message,
    });
  }
};
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
