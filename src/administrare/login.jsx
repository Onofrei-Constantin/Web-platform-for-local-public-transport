import { useState, useEffect } from "react";
import {useNavigate } from 'react-router-dom';
import axios from "axios";
import ContainerPagina from "../componente/containerPagina";


const Login = () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [parola, setPassword] = useState("");
    const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
        navigate('/');
     }
  }, [navigate]);

  const loginHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "http://localhost:3001/auth/login",
        { email, parola },
        config
      );

      localStorage.setItem("authToken", data.accessToken);
      localStorage.setItem("authRefreshToken", data.refreshToken)

      navigate('/');
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <ContainerPagina>
    <div >
      <form onSubmit={loginHandler} >
        <h3 >Login</h3>
        {error && <span >{error}</span>}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            tabIndex={1}
          />
        </div>
        <div >
          <label htmlFor="parola">
            Password:{" "}
          </label>
          <input
            type="password"
            required
            id="parola"
            placeholder="Introdu parola"
            onChange={(e) => setPassword(e.target.value)}
            value={parola}
            tabIndex={2}
          />
        </div>
        <button type="submit" >
          Login
        </button>
      </form>
    </div>
    </ContainerPagina>
  );
};

export default Login;