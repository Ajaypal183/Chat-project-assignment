import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("user"); 
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
    const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        role,
        id
        
      });
      console.log(role, id)
      console.log("Response:", res.data);
      setMessage(res.data.message);

      if (res.data.success) {
        navigate("/chat", { state: { role, id } });
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <label>
        Select Role:
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="agent">Agent</option>
        </select>
      </label>
      <br />

      <input
        type="text"
        placeholder="Enter ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <br />

      <button onClick={handleLogin}>Login</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
