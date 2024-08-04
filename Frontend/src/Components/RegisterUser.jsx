import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addEmail,
  addPassword,
  addFullName,
  addUsername,
  addAvatar,
  addCoverImage,
} from "../index.js";

function RegisterUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleRegisterUser = (e) => {
    e.preventDefault();
    dispatch(addEmail(email));
    dispatch(addPassword(password));
    dispatch(addFullName(fullName));
    dispatch(addUsername(username));
    dispatch(addAvatar(avatar));
    dispatch(addCoverImage(coverImage));
    navigate("/");
  };

  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  return (
    <form onSubmit={handleRegisterUser}>
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange(setAvatar)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange(setCoverImage)}
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterUser;
