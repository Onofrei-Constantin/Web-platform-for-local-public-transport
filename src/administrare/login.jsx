import { useState, useEffect ,useContext} from "react";
import {useNavigate } from 'react-router-dom';
import axios from "axios";
import { axiosJWT } from '../componente/axiosJWT';
import ContainerPagina from "../componente/containerPagina";
import { UserContext } from "../componente/UserContext";
import { AbonamentContext } from "../componente/AbonamentContext";

const Login = () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [parola, setPassword] = useState("");
    const [error, setError] = useState("");
    const {setUser} = useContext(UserContext);
    const {setAbonament} = useContext(AbonamentContext);

  useEffect(() => {
    if (localStorage.getItem("authToken") && localStorage.getItem("authRefreshToken")) {
        navigate(-1);
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
      setUser({user:data.email,cnp:data.cnp});

      const configAbonament = {
          headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
           },
      };

      await axiosJWT.get('http://localhost:3001/private/vanzariAbonament/'+data.email,configAbonament)
        .then(response=>{ 
            if(response.data.length>0)
            {
              setAbonament(response.data);
            }
            else
            {
              setAbonament(null);
            }
        })
        .catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            }
        }); 
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