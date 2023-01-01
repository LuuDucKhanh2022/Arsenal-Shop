import {
    ALL_SUBCATEGORY_FAIL,
    ALL_SUBCATEGORY_REQUEST,
    ALL_SUBCATEGORY_SUCCESS,
    SUBCATEGORY_DETAILS_FAIL,
    SUBCATEGORY_DETAILS_REQUEST,
    SUBCATEGORY_DETAILS_SUCCESS,
    STOP_BUSINESS_SUBCATEGORY_FAIL,
    STOP_BUSINESS_SUBCATEGORY_REQUEST,
    STOP_BUSINESS_SUBCATEGORY_RESET,
    STOP_BUSINESS_SUBCATEGORY_SUCCESS,
    NEW_SUBCATEGORY_FAIL,
    NEW_SUBCATEGORY_REQUEST,
    NEW_SUBCATEGORY_RESET,
    NEW_SUBCATEGORY_SUCCESS,
    UPDATE_SUBCATEGORY_FAIL,
    UPDATE_SUBCATEGORY_REQUEST,
    UPDATE_SUBCATEGORY_RESET,
    UPDATE_SUBCATEGORY_SUCCESS,
    CLEAR_ERRORS
  } from "../constans/SubCategoryConstans";
  
  
  export const subCategoryReducer = (state = { subCategories: [], }, action) => {
    switch (action.type) {
      case ALL_SUBCATEGORY_REQUEST:
        return {
          loading: true,
          subCategories: [],
        };
      case ALL_SUBCATEGORY_SUCCESS:
        return {
          loading: false,
          subCategories: action.payload.subCategory,
        };
      case ALL_SUBCATEGORY_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
          return state;
    }
  };
  
  export const subCategoryDetailsReducer = (state = { subCategory: {} }, action) => {
    switch (action.type) {
      case SUBCATEGORY_DETAILS_REQUEST:
        return {
          loading: true,
          ...state,
        };
      case SUBCATEGORY_DETAILS_SUCCESS:
        return {
          loading: false,
          subCategory: action.payload,
        };
      case SUBCATEGORY_DETAILS_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  
  export const updateSubCategoryReducer = (state = {}, action) => {
    switch (action.type) {
      case STOP_BUSINESS_SUBCATEGORY_REQUEST:
      case UPDATE_SUBCATEGORY_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case STOP_BUSINESS_SUBCATEGORY_SUCCESS:
        return {
          ...state,
          loading: false,
          isStopBusinesses: action.payload,
        };
  
      case UPDATE_SUBCATEGORY_SUCCESS:
        return {
          ...state,
          loading: false,
          isUpdated: action.payload,
        };
      case STOP_BUSINESS_SUBCATEGORY_FAIL:
      case UPDATE_SUBCATEGORY_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case STOP_BUSINESS_SUBCATEGORY_RESET:
        return {
          ...state,
          isStopBusinesses: false,
        };
      case UPDATE_SUBCATEGORY_RESET:
        return {
          ...state,
          isUpdated: false,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  // New Product ----Admin
  export const newSubCategoryReducer = (state = { subCategory: {} }, action) => {
    switch (action.type) {
      case NEW_SUBCATEGORY_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case NEW_SUBCATEGORY_SUCCESS:
        return {
          loading: false,
          success: action.payload.success,
          subCategory: action.payload.Category,
        };
      case NEW_SUBCATEGORY_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case NEW_SUBCATEGORY_RESET:
        return {
          ...state,
          success: false,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  