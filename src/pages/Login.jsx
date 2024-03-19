import React, { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "../index";
import "../css/LoginSignUp.css";
import "../firebase/firebaseConfig.js";
import "./Home";
import "./SignUp";
 
var Login = () => {
  const [userEmail, isUserEmail] = useState("");
  const [userPassword, isUserPassword] = useState("");
  const [loginError, isLoginError] = useState("");
  const auth = getAuth();

  useEffect(() => {
    document.title = "CookBook-Pro: Login";
    document.body.classList.add("loginPage");
    document.body.style.backgroundColor = "#E0EAFC";
  }, []);

  const checkInput = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );
      const user = userCredential.user;
      document.location.href = "/";
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      isLoginError("Invalid Email Or Password");
      console.log(errorCode, errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      isUserEmail(user.email);
      document.location.href = "/search";
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      isLoginError("Invalid Credentials");
      console.log(errorCode, errorMessage);
    }
  };

  return (
    <div className="LogIn">
      <h1 className="Title">Log In</h1>
      <br />
      <center>
        <button
          type="button"
          className="googleSignInButton"
          onClick={signInWithGoogle}
        >
          Log In with Google
        </button>
      </center>
      <form>
        <label className="Email">
          Email<br></br>
        </label>
        <input
          value={userEmail}
          onChange={(e) => isUserEmail(e.target.value)}
          className="getEmail"
          type="text"
          id="isEmail"
          name="isEmail"
        />
        <br />
        <label className="Password">
          Password<br></br>
        </label>
        <input
          value={userPassword}
          onChange={(e) => isUserPassword(e.target.value)}
          className="getPassword"
          type="password"
          id="isPassword"
          name="isPassword"
        />
        <div className="InvalidInput">
          <span style={{ color: "blue" }}>Forgot Password?</span>
        </div>
        {loginError ? <label className="isInvalid">{loginError}</label> : null}
        <input
          className="isValidate"
          type="button"
          id="isValid"
          onClick={(e) => checkInput(e)}
          value={"Log In"}
        />
      </form>
      <br />
      <p style={{ textAlign: "center" }}>
        <a href="/SignUp">Dont Have An Account? Create Account</a>
      </p>
    </div>
  );
};

export default Login;
