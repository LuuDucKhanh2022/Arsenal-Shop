import {
    ADD_TO_CART,
    EMPTY_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO,
  } from "../constans/CartConstans";
  
  export const cartReducer = (
    state = { cartItems: [], shippingInfo: {} },
    action
  ) => {
    switch (action.type) {
      case ADD_TO_CART:
        const item = action.payload;
     
        const isItemExist = state.cartItems.find(
          (i) => i.id === item.id && i.size === item.size
        );

        if (isItemExist) {
          return {
            ...state,
            cartItems: state.cartItems.map((i) =>
              i.id === isItemExist.id && i.size === isItemExist.size ? item : i
            ),
          };
        } else {
          return {
            ...state,
            cartItems: [...state.cartItems, item],
          };
      }

      case REMOVE_CART_ITEM:
        return {
          ...state,
          cartItems: state.cartItems.filter((i) => { 
            return i.id !== action.payload.id ||  (i.id === action.payload.id && i.size !== action.payload.size)}),
        };

      case EMPTY_CART:
        return {
          ...state,
          cartItems : []
        }  
  
      case SAVE_SHIPPING_INFO:
        return {
          ...state,
          shippingInfo: action.payload,
        };
  
      default:
        return state;

    }
  };

