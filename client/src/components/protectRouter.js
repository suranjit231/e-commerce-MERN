import { useEffect } from "react";
import { authSelector } from "../redux/authReducer/authReducer";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {
    const { isLoggedIn, loading } = useSelector(authSelector);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            toast.error("Please log in to access this page.");
            // Save the current location they were trying to access
            navigate("/auth", { state: { from: location } });
        }
    }, [isLoggedIn, navigate, loading, location]);

    if (!isLoggedIn) {
        return null;
    }

    return children;
}
