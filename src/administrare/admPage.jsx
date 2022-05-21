import { useEffect,useState } from "react";
import {useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from "axios";
import React from "react";
import ContainerPagina from "../componente/containerPagina";


const AdmPage = ()  => {
  let navigate = useNavigate();
  const [error, setError] = useState(false);
  const [news, setNews] = useState(null);
  
  const refreshToken = async ()=>{
    try {
      const res = await axios.post("http://localhost:3001/auth/refresh",{token : localStorage.getItem("authRefreshToken")})
      localStorage.setItem("authToken", res.data.accessToken)
      localStorage.setItem("authRefreshToken", res.data.refreshToken)
      return res.data;
    } catch (error) {
      console.log(error)
    }
  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) =>{
      let currentDate = new Date();
      const decodedToken = jwt_decode(localStorage.getItem("authToken"))
      
      if(decodedToken.exp * 1000 < currentDate.getTime())
      {
        const data = await refreshToken();
        config.headers["Authorization"] = "Bearer " + data.accessToken;
      }

      return config;
    },(error)=>{
      return Promise.reject(error);
    }

  );

  useEffect(() => {
    if(error||!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
    {
      navigate('/')
    }
  }, [navigate,error]);



  useEffect(() => {
    const fetchAnunturiPrivate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        await axiosJWT.get('http://localhost:3001/private/anunturiProtejate',config)
        .then(response=>{
                if(response.data.length>0)
                {
                    setNews(response.data);
                }
            })
      } catch (error) {
        setError(true);
      }
    };

    fetchAnunturiPrivate();
  }, [axiosJWT]);

  const logoutHandler = ()=>{
      localStorage.removeItem("authToken");
      localStorage.removeItem("authRefreshToken");
      navigate('/login');
  }


  if(news==null)
  {
      return  (
      <ContainerPagina>
          <div >
              <h1>Se incarca datele...</h1>
          </div>
      </ContainerPagina>
      );
  }


  function afisareNews(info){
        return info.map((el,index)=>{
            return(
                <div key={index}>
                    <h2>{el.titlu}</h2>
                    <h3>{el.tip}</h3>
                    <p>{el.text}</p>
                </div>
            );
        })
    }

    return  (
      <ContainerPagina>
          <div >
            <div>
              {afisareNews(news)}
            </div>
            <button className="" onClick={logoutHandler}>Logout</button>
            <h1>Administrare</h1>
            <button className="" onClick={()=>navigate('/inregistrare-administrare')}>Adauga User</button>
          </div>
        </ContainerPagina>
    );
}

export default AdmPage;
