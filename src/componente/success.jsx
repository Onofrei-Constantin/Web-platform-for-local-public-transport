import React,{useState,useEffect,useContext}  from "react";
import ContainerPagina from "../componente/containerPagina";
import { AbonamentContext } from "../componente/AbonamentContext";
import { UserContext } from "../componente/UserContext";
import {useNavigate } from 'react-router-dom';
import { axiosJWT } from "./axiosJWT";

const Success = ()  => {
  let navigate = useNavigate();
  const {setAbonament} = useContext(AbonamentContext);
  const {user} = useContext(UserContext);
  const [seIncarca, setSeIncarca] = useState(true);


  useEffect(() => {
        if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
        {
            navigate('/');
        }
    }, [navigate]);

  useEffect(()=>{
        const getAbonamentUser = async ()=>{
        
        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };

        await axiosJWT.post('http://localhost:3001/private/vanzariAbonament',{user:user.user},config)
            .then(response=>{ 
                if(response.data.length>0)
                {
                  setAbonament(response.data);
                }
                else
                {
                  setAbonament(null);
                }
                setSeIncarca(false);
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

        getAbonamentUser();

    },[user,setAbonament]);

    if(seIncarca)
    {
        return (
        <ContainerPagina>
            <div >
                <h1>Se incarca datele...</h1>
            </div>
        </ContainerPagina>
        );
    }

  return (
    <ContainerPagina>
      <div >
        <h1>Success</h1>
      </div>
    </ContainerPagina>
  );
}

export default Success;
