import { useEffect } from "react";
import {useNavigate } from 'react-router-dom';
import React from "react";
import ContainerPagina from "../componente/containerPagina";


const AdmPage = ()  => {
  let navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem("authToken"))
    {
      navigate('/login-administrare')
    }
    }, [navigate]);

    const logoutHandler = ()=>{
      localStorage.removeItem("authToken");
      navigate('/login-administrare');
    }

    return (
        <ContainerPagina>
          <div >
            <button className="" onClick={logoutHandler}>Logout</button>
            <h1>Administrare</h1>
            <button className="" onClick={()=>navigate('/inregistrare-administrare')}>Adauga User</button>
          </div>
        </ContainerPagina>
    );

     
}

export default AdmPage;
