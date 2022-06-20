import React,{useState,useEffect} from "react";
import {useNavigate } from 'react-router-dom';
import ContainerPagina from "../componente/containerPagina";
import { axiosJWT } from "../componente/axiosJWT";

const Validari = ()  => {
    let navigate = useNavigate();
    const [seIncarca, setSeIncarca] = useState(true);
    const [validari,setValidari] = useState(null);

  useEffect(() => {
    if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
    {
      navigate('/')
    }
  }, [navigate]);


  useEffect(()=>{
        const getValidari = async ()=>{
        
        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };

        await axiosJWT.get('http://localhost:3001/private/validari',config)
            .then(response=>{ 
                if(response.data.length>0)
                {
                  setValidari(response.data);
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

        getValidari();

    },[]);


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

    function afisareValidari(info){
        return info.filter(el=>el.validat===false&&el.anulat===false).map((el,index)=>{
            return(
                <div key={index}>
                    <h1>{el.user}</h1>
                    <h1>{el.idTranzactie}</h1>
                    <button onClick={()=>handleValideaza(el)}>Valideaza</button>
                </div>
            );
        })
    }

    function afisareValidariAnulate(info){
        return info.filter(el=>el.anulat===true).map((el,index)=>{
            return(
                <div key={index}>
                    <h1>{el.user}</h1>
                    <h1>{el.idTranzactie}</h1>
                </div>
            );
        })
    }

    function afisareValidariRealizate(info){
        return info.filter(el=>el.validat===true).map((el,index)=>{
            return(
                <div key={index}>
                    <h1>{el.user}</h1>
                    <h1>{el.idTranzactie}</h1>
                </div>
            );
        })
    }

    const handleValideaza = (props)=>{
        const {user,idTranzactie,imagini} = props;
        navigate('/confirmare-validare',{state:{user:user,idTranzactie:idTranzactie,imagini:imagini}});
    }

  return (
    <ContainerPagina>
      <div >
        <h1>De validat sau anulat</h1>
        {afisareValidari(validari||[])}
        <h1>Anulate</h1>
        {afisareValidariAnulate(validari||[])}
        <h1>Validate</h1>
        {afisareValidariRealizate(validari||[])}
      </div>
    </ContainerPagina>
  );
}

export default Validari;
