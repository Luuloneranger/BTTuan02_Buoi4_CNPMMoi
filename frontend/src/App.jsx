import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* Nơi hiển thị các trang con khi đổi URL */}
      </main>
    </div>
  );
}

export default App;
