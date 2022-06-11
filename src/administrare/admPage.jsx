import {useNavigate } from 'react-router-dom';
import React, {useEffect,useState} from "react";
import ContainerPagina from "../componente/containerPagina";
import { axiosJWT } from '../componente/axiosJWT';


const AdmPage = ()  => {
  let navigate = useNavigate();
  const [error, setError] = useState(false);
  const [news, setNews] = useState(null);
  const [vanzari, setVanzari] = useState(null);

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
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
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

    const fetchVanazari = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        await axiosJWT.get('http://localhost:3001/private/vanzari',config)
        .then(response=>{
                if(response.data.length>0)
                {
                  setVanzari(response.data);
                }
            })
      } catch (error) {
        setError(true);
      }
    };


    fetchAnunturiPrivate();
    fetchVanazari();
  }, []);


  if(news==null||vanzari==null)
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

    function afisareVanzari(info){
        return info.map((el,index)=>{
            return(
                <div key={index}>
                    <h2>{el.dataStart}</h2>
                    <h3>{el.dataStop}</h3>
                    <p>{el.numeBilet}</p>
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
            <div>
              {afisareVanzari(vanzari)}
            </div>
            <h1>Administrare</h1>
            <button className="" onClick={()=>navigate('/inregistrare-administrare')}>Adauga User</button>
          </div>
        </ContainerPagina>
    );
}

export default AdmPage;
