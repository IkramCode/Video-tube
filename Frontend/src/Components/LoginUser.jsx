import React from "react";
import { useNavigate } from "react-router-dom";
import { enterEmail, enterPassword } from "../index.js";
import { useDispatch } from "react-redux";
import { useState } from "react";

function LoginUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLoginUser = (e) => {
    e.preventDefault();
    dispatch(enterEmail(email));
    dispatch(enterPassword(password));
    navigate("/");
  };

  return (
    <form onSubmit={handleLoginUser}>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginUser;
