import React,{useState,useEffect} from "react";
import ContainerPagina from "../componente/containerPagina";
import { axiosJWT } from "../componente/axiosJWT";
import {useNavigate} from 'react-router-dom';

const ValidareFaraCerere = ()  => {
    let navigate = useNavigate();
    const [seIncarca1, setSeIncarca1] = useState(true);
    const [seIncarca2, setSeIncarca2] = useState(true);
    const [vanzari,setVanzari] = useState(null);
    const [vanzariRestul,setVanzariRestul] = useState([]);

    useEffect(() => {
        if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
        {
            navigate('/');
        }
    }, [navigate]);


    useEffect(()=>{
        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };


        const getValidari = async ()=>{


        await axiosJWT.get('http://localhost:3001/private/vanzari',config)
            .then(response=>{ 
                if(response.data.length>0)
                {
                  setVanzari(response.data);
                }
                setSeIncarca1(false);
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


        const getRestul = async ()=>{


        await axiosJWT.get('http://localhost:3001/private/vanzariRestul',config)
            .then(response=>{ 
                if(response.data.length>0)
                {
                  setVanzariRestul(response.data);
                }
                setSeIncarca2(false);
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
        getRestul();
    },[]);

    if(seIncarca1||seIncarca2)
    {
        return (
        <ContainerPagina>
            <div >
                <h1>Se incarca datele...</h1>
            </div>
        </ContainerPagina>
        );
    }

    const handleValideaza = async (props,index)=>{
        const {_id,valabilitateTip,perioada} = props;
        let dataStart;
        let dataStop;
        let dataStartISO;
        let dataStopISO;
        const date = new Date();
        switch (valabilitateTip) {
                case "luna": 
                    dataStart = new Date(date.getFullYear(),date.getMonth(), date.getDate());
                    dataStop = new Date(date.getFullYear(),date.getMonth()+1, date.getDate()-1);
                    break;
                case "zi":
                    dataStart = date;
                    dataStop = date; 
                    break;
                case "zile":
                    dataStart = new Date(date.getFullYear(),date.getMonth(), date.getDate());
                    dataStop = new Date(date.getFullYear(),date.getMonth(), date.getDate()+perioada-1);  
                    break;
                default:
                    break;
            };
        dataStartISO = new Date(dataStart.getTime() - dataStart.getTimezoneOffset() * 60000);
        dataStopISO = new Date(dataStop.getTime() - dataStop.getTimezoneOffset() * 60000);

        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };

        try {
            await axiosJWT.post('http://localhost:3001/private/validariValideaza/'+_id,config);
            
            await axiosJWT.post('http://localhost:3001/private/vanzariValidare',{id:_id,dataStart:dataStartISO,dataStop:dataStopISO},config);

            vanzari[index].activ=true;
            setVanzariRestul(vanzariRestul=>[...vanzariRestul,vanzari[index]]);
            setVanzari(vanzari.filter(vanzari=>vanzari.activ!==true));
        } catch (error) {
            console.log(error);
        }
    }

    const handleAnuleaza = async (props,index)=>{
        const {_id,pret,idPayment} = props;
        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };
        if(pret===0)
        {
            try {
                await axiosJWT.post('http://localhost:3001/private/vanzariAnuleaza/'+_id);
                
                await axiosJWT.post('http://localhost:3001/private/validariAnuleaza/'+_id,config);

                vanzari[index].anulat=true;
                vanzari[index].expirat=true;
                setVanzariRestul(vanzariRestul=>[...vanzariRestul,vanzari[index]]);
                setVanzari(vanzari.filter(vanzari=>vanzari.anulat!==true&&vanzari.expirat!==true));
            } catch (error) {
                console.log(error)
            }
        }
        else
        {
             try {
                const config = {
                    headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                };

                await axiosJWT.post('http://localhost:3001/private/cancelPayment',{payment_intent:idPayment},config)
                
                await axiosJWT.post('http://localhost:3001/private/vanzariAnuleaza/'+_id);

                await axiosJWT.post('http://localhost:3001/private/validariAnuleaza/'+_id,config);

                vanzari[index].anulat=true;
                vanzari[index].expirat=true;
                setVanzariRestul(vanzariRestul=>[...vanzariRestul,vanzari[index]]);
                setVanzari(vanzari.filter(vanzari=>vanzari.anulat!==true&&vanzari.expirat!==true));

            } catch (error) {
                console.log(error)
            }
        }
    }


    function afisareVanzariNevalidate(info){

        return info.map((el,index)=>{
            return(
                <div key={index}>
                    <h1>{el.user}</h1>
                    <h1>{el.idBilet}</h1>
                    <h1>{el.tip}</h1>
                    <h1>{el.pret}</h1>
                    <button onClick={()=>{handleValideaza(el,index)}}>Valideaza</button>
                    <button onClick={()=>{handleAnuleaza(el,index)}}>Anuleaza</button>
                </div>
            );
        })
    }

    function afisareVanzariRestul(info){
        return info.map((el,index)=>{
            return(
                <div key={index}>
                    <h1>{el.user}</h1>
                    <h1>{el.idBilet}</h1>
                    <h1>{el.tip}</h1>
                    <h1>{el.pret}</h1>
                </div>
            );
        })
    }
  
    return (
        <ContainerPagina>
            <div >
                <h1>Vanzari nevalidate</h1>
                <div>
                    {afisareVanzariNevalidate(vanzari||[])}
                </div>
                <h1>Vanzari validate/expirate/anulate</h1>
                <div>
                    {afisareVanzariRestul(vanzariRestul||[])}
                </div>
            </div>
        </ContainerPagina>
    );
}

export default ValidareFaraCerere;
