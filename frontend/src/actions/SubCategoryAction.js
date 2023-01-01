import axios from "axios";
import {
  ALL_SUBCATEGORY_FAIL,
  ALL_SUBCATEGORY_REQUEST,
  ALL_SUBCATEGORY_SUCCESS,
  NEW_SUBCATEGORY_FAIL,
  NEW_SUBCATEGORY_REQUEST,
  NEW_SUBCATEGORY_SUCCESS,
  CLEAR_ERRORS,
  STOP_BUSINESS_SUBCATEGORY_REQUEST,
  STOP_BUSINESS_SUBCATEGORY_SUCCESS,
  STOP_BUSINESS_SUBCATEGORY_FAIL,
  UPDATE_SUBCATEGORY_REQUEST,
  UPDATE_SUBCATEGORY_SUCCESS,
  UPDATE_SUBCATEGORY_FAIL,
  SUBCATEGORY_DETAILS_REQUEST,
  SUBCATEGORY_DETAILS_SUCCESS,
  SUBCATEGORY_DETAILS_FAIL,
} from "../constans/SubCategoryConstans";

export const getAllSubCategories = () => async (dispatch) => {
  try {
    dispatch({
      type: ALL_SUBCATEGORY_REQUEST,
    });
    const { data } = await axios.get("/api/v2/subcategories");

    dispatch({
      type: ALL_SUBCATEGORY_SUCCESS,
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
      type: ALL_SUBCATEGORY_FAIL,
      payload: message,
    });
  }
};

// Get  Products Details
export const getSubCategoryDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SUBCATEGORY_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v2/subcategories/${id}`);

    dispatch({
      type: SUBCATEGORY_DETAILS_SUCCESS,
      payload: data.subCategory,
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
      type: SUBCATEGORY_DETAILS_FAIL,
      payload: message,
    });
  }
};

export const updateSubCategory = (id, subCategoryData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_SUBCATEGORY_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.put(
      `/api/v2/subcategories/${id}`,
      subCategoryData,
      config
    );

    dispatch({
      type: UPDATE_SUBCATEGORY_SUCCESS,
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
      type: UPDATE_SUBCATEGORY_FAIL,
      payload: message,
    });
  }
};

export const createSubCategory = (subCategoryData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_SUBCATEGORY_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      `/api/v2/subcategories`,
      subCategoryData,
      config
    );

    dispatch({
      type: NEW_SUBCATEGORY_SUCCESS,
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
      type: NEW_SUBCATEGORY_FAIL,
      payload: message,
    });
  }
};

export const stopBusinessSubCategory = (id) => async (dispatch) => {
  try {
    dispatch({ type: STOP_BUSINESS_SUBCATEGORY_REQUEST });

    const { data } = await axios.put(`/api/v2/subcategories/${id}/state`);

    dispatch({
      type: STOP_BUSINESS_SUBCATEGORY_SUCCESS,
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
      type: STOP_BUSINESS_SUBCATEGORY_FAIL,
      payload: message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
