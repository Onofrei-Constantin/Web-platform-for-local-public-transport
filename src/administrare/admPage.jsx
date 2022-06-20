import {useNavigate } from 'react-router-dom';
import React, {useEffect} from "react";
import ContainerPagina from "../componente/containerPagina";



const AdmPage = ()  => {
  let navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
    {
      navigate('/')
    }
  }, [navigate]);

    return  (
      <ContainerPagina>
          <div >
            <h1>Administrare</h1>
          </div>
      </ContainerPagina>
    );
}

export default AdmPage;
