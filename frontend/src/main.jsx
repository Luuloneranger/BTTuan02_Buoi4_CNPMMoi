import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index.js";

import App from "./App.jsx";
import "./styles/global.css";
import RegisterPage from "./pages/register.jsx";
import LoginPage from "./pages/login.jsx";
import HomePage from "./pages/home.jsx";
import ApartmentDetail from "./pages/detail.jsx";
import ForgotPasswordPage from "./pages/forgot-password.jsx";
import ProfilePage from "./pages/profile.jsx";
import BookingCart from "./pages/BookingCart.jsx";
import ResidentDashboard from "./pages/ResidentDashboard.jsx";
import PurchasedApartments from "./pages/PurchasedApartments.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "apartments/:id", element: <ApartmentDetail /> }, // Trang chi tiết sản phẩm
      { path: "profile", element: <ProfilePage /> },
      { path: "cart", element: <BookingCart /> },
      { path: "resident-dashboard", element: <ResidentDashboard /> },
      { path: "purchased", element: <PurchasedApartments /> },
    ],
  },
  { path: "register", element: <RegisterPage /> },
  { path: "login", element: <LoginPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> }, // Trang quên mật khẩu đổi mật khẩu
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
