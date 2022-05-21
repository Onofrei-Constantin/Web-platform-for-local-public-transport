import React,{ useEffect, useState } from "react";
import ContainerPagina from "../componente/containerPagina";
import {useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/anunt.css'

const Anunt = ()  => {

  const {state} = useLocation();
  const[idAnunt,setIdAnunt] = useState(null);
  const[anunt,setAnunt] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
      if(state!=null)
      {
          const { id } = state;
          setIdAnunt(id);
      }
    },[state]);

    useEffect(()=>{
      const getAnunt = () =>{
        axios.get('http://localhost:3001/public/anunturiGaseste/'+idAnunt)
              .then( response=>{
                  setAnunt(response.data);
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
        }
        if(idAnunt!=null)
        {
          getAnunt();
        }
    },[idAnunt])

    if(anunt==null)
    {
        return (
        <ContainerPagina>
            <div >
                <h1>Se incarca anunt...</h1>
            </div>
        </ContainerPagina>
        );
    }

    function renderAnunt()
    {
      return(
        <div className="anunt-sectiune">
          <h2 className="anunt-h2">{anunt.titlu}</h2>
          <h3 className="anunt-h3">{anunt.tip}</h3>
          <p className="anunt-p">{anunt.text}</p>
          <img className={anunt.imagine===null ? '' : "anunt-imagine-prezenta"} src={anunt.imagine} alt=""/> 
        </div>
      );
    }

  return (
    <ContainerPagina>
      <div className="anunt-container">
        {renderAnunt()}
        <button className="anunt-buton" onClick={()=>navigate(-1)}>Inapoi</button>
      </div>
    </ContainerPagina>
  );
}

export default Anunt;
