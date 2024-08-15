import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authSelector } from "../redux/authReducer/authReducer";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import ErrorPage from "../pages/errorPage/ErrorPage";

export default function AdminProtectedRoute({ children }) {
  const { isLoggedIn, user, loading } = useSelector(authSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast.error("Please log in to access this page.");
      navigate("/auth");
    }
  }, [isLoggedIn, loading, navigate]);

  useEffect(() => {
    if (!loading && isLoggedIn && user?.role !== "admin") {
      toast.error("Unauthorized access.");
      navigate("/error");
    }
  }, [isLoggedIn, loading, navigate, user?.role]);

  if (!isLoggedIn || user?.role !== "admin") {
    return <div className="spinner-container"><ClipLoader size={50} color={"#123abc"} loading={true} /></div>;
  }

  return children;
}
