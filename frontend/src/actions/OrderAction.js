import axios from "axios";
import {
  ALL_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  CREATE_ORDER_FAIL,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  MY_ORDERS_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  UPDATE_ORDER_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
} from "../constans/OrderConstans";
import { CLEAR_ERRORS } from "../constans/userContans";

// Create Order
export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post("/api/v2/orders", order, config);

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: message,
    });
  }
};

// My Orders
export const myOrders = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ORDERS_REQUEST });

    const { data } = await axios.get("/api/v2/orders/me");

    dispatch({ type: MY_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: MY_ORDERS_FAIL,
      payload: message,
    });
  }
};

// Get Order Details
export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v2/orders/${id}`);

    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.order });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: message,
    });
  }
};

// All order  -----Admin
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDERS_REQUEST });

    const { data } = await axios.get("/api/v2/orders");

    dispatch({ type: ALL_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: message,
    });
  }
};

// Update Order
export const updateOrder = (id, order) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(`/api/v2/orders/${id}`, order, config);

    dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: message,
    });
  }
};

// Delete Order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });

    const { data } = await axios.delete(`/api/v2/orders/${id}`);

    dispatch({ type: DELETE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    let message;
    typeof error.response.data === "string"
      ? (message = error.response.data.slice(
          error.response.data.lastIndexOf("Error") + 6,
          error.response.data.indexOf("<br>")
        ))
      : (message = error.response.data.message);
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
