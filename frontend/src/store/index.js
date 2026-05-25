import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import apartmentReducer from "./apartmentSlice";
import contractReducer from "./contractSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    apartments: apartmentReducer,
    contracts: contractReducer,
    cart: cartReducer,
  },
});
