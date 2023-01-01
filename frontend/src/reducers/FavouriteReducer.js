import { UPDATE_FAVOURITE_STOCK } from "../constans/CartConstans";
import {
  ADD_TO_FAVOURITE,
  REMOVE_FROM_FAVOURITE,
} from "../constans/FavouriteConstans";

export const favouriteReducer = (state = { favouriteItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_FAVOURITE:
      const item = action.payload;

      const isItemExist = state.favouriteItems.find(
        (i) => i.id === item.id 
      );

      if (isItemExist) {
        return {
          ...state,
          favouriteItems: state.favouriteItems.map((i) =>
            i.id === isItemExist.id ? item : i
          ),
        };
      } else {
        return {
          ...state,
          favouriteItems: [...state.favouriteItems, item],
        };
      }
    case UPDATE_FAVOURITE_STOCK:
      const favouriteItems = action.payload;
      return {
        ...state,
        favouriteItems
      }  
    case REMOVE_FROM_FAVOURITE:
      return {
        ...state,
        favouriteItems: state.favouriteItems.filter(
          (i) => i.id !== action.payload
        ),
      };

    default:
      return state;
  }
};
