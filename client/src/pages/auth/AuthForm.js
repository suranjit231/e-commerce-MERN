import React, { useState, useEffect } from "react";
import styles from "./AuthForm.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupApiAsync, signinApiAsync, authSelector } from "../../redux/authReducer/authReducer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { loadingSelector } from "../../redux/loaderReducer/loaderReducer";

export default function AuthForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupForm, setSignUpForm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, isSignup, error, user } = useSelector(authSelector);
  const {loading} = useSelector(loadingSelector);
  const location = useLocation();

  useEffect(() => {
    if (isSignup) {
      toggleSignInAndSignUp();
      clearInput();
      toast.success("Signup successful!");
    }
  }, [isSignup]);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      toast.success("Signin successful!");
      if (user?.role === 'admin') {
        navigate("/admin");  // Redirect to admin page if the user is an admin
      } else {
        // Redirect to the previous location if it exists, otherwise to home
        navigate(location.state?.from || "/");
      }
    }
  }, [isLoggedIn, navigate, user?.role, loading, location.state?.from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  function toggleSignInAndSignUp() {
    setSignUpForm((prev) => !prev);
    clearInput();
  }

  async function handleAuthFormSubmit(e) {
    e.preventDefault();

    if (isSignupForm) {
      if (!name.trim() || !email.trim() || !password.trim()) return;
      dispatch(signupApiAsync({ name, email, password }));
    } else {
      if (!email.trim() || !password.trim()) return;
      dispatch(signinApiAsync({ email, password }));
    }
  }

  function clearInput() {
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className={styles.authFormContainer}>
      <form onSubmit={handleAuthFormSubmit}>
        <h2>{isSignupForm ? "Sign Up" : "Sign In"}</h2>
        <div className={styles.authFormBox}>
          {isSignupForm && (
            <div className={styles.formControlDiv}>
              <label htmlFor="name">
                <i className="fa-regular fa-user"></i>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="User name..."
              />
            </div>
          )}

          <div className={styles.formControlDiv}>
            <label htmlFor="email">
              <i className="fa-regular fa-envelope"></i>
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="User email..."
            />
          </div>

          <div className={styles.formControlDiv}>
            <label htmlFor="password">
              <i className="fa-solid fa-unlock-keyhole"></i>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="User password..."
            />
          </div>

          <div className={styles.formControlBtnDiv}>
            <button type="submit" disabled={loading}>
              {loading ? <ClipLoader size={15} color={"#fff"} /> : isSignupForm ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </form>

      <div className={styles.redirectAuthDiv}>
        {isSignupForm ? (
          <>Already have an account? <span onClick={toggleSignInAndSignUp}>Sign In</span></>
        ) : (
          <>Don't have an account? <span onClick={toggleSignInAndSignUp}>Sign Up</span></>
        )}
      </div>
    </div>
  );
}
