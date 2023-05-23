import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import axios from "axios";
import User from "./pages/User";
import Filter from "./pages/Filters";

function App() {
  const [data, setData] = useState(() =>
    localStorage.getItem("data") ? localStorage.getItem("data") : null
  );

  useEffect(() => {
    if (!localStorage.getItem("data")) {
      axios
        .get("https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1/users")
        .then((response) => {
          localStorage.setItem("data", JSON.stringify(response.data));

          return response.data;
        })
        .then((data) => {
          setData(data);
        });
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/users" element={<Dashboard data={data} />} />
        <Route
          path="/filter"
          element={<Filter data={data} setData={setData} />}
        />
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
