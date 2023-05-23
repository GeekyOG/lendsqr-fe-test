import React, { useState } from "react";
import loginImage from "../images/pablo-sign-in 1.png";
import logo from "../images/Group.png";

import "./styles/login.css";

function Login() {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="login-container">
      <div className="content-wrapper flex items-center">
        <div className="left w-1/2 xsMax:hidden">
          <div>
            <img className="logo" src={logo} />
          </div>
          <div className="flex items-center img-wrpper">
            <img src={loginImage} alt="login-image" />
          </div>
        </div>
        <div className="right">
          <div className="flex items-center justify-center h-[100%]">
            <div className="xsMax:w-[90%]">
              <h1 className="heading">Welcome!</h1>
              <p className="text mb-10">Enter details to login.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = "./users";
                }}
              >
                <div className="input-wrapper">
                  <input placeholder="Email" />
                </div>
                <div className="input-wrapper">
                  <input
                    placeholder="Password"
                    type={show ? "text" : "password"}
                  />
                  <p
                    className="form-text cursor-pointer"
                    onClick={() => setShow(!show)}
                  >
                    {show ? "Hide" : "Show"}
                  </p>
                </div>

                <p className="form-text cursor-pointer">Forgot Password?</p>

                <button type="submit">LOG IN</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
