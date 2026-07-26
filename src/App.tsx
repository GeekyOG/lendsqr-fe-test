import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "@/pages/Login/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import AppLayout from "@/components/layout/AppLayout/AppLayout";
import Users from "@/pages/Users/Users";
import UserDetails from "@/pages/UserDetails/UserDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
