import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ProductType } from "@/types/product";

type InitialState = {
  items: CartItem[];
};

type CartItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  type?: ProductType;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

const initialState: InitialState = {
  items: [],
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<any>) => {
      const payload = action.payload;
      const existingItem = state.items.find((item) => item.id === payload.id);

      // Handle both old format and API format
      const title = payload.title || payload.name || 'Product';
      const price = payload.price || 0;
      const discountedPrice = payload.discountedPrice || payload.price || price;

      // Handle images - support both formats
      let imgs = payload.imgs;
      if (!imgs && payload.images && Array.isArray(payload.images)) {
        imgs = {
          thumbnails: payload.images,
          previews: payload.images,
        };
      }

      if (existingItem) {
        existingItem.quantity += payload.quantity || 1;
      } else {
        state.items.push({
          id: payload.id,
          title,
          price,
          quantity: payload.quantity || 1,
          discountedPrice,
          imgs,
          type: payload.type,
        });
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;
export default cart.reducer;
