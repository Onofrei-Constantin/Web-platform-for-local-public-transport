import React,{useEffect,useState} from "react";
import ContainerPagina from "../componente/containerPagina";
import {useNavigate } from 'react-router-dom';
import {QrReader} from 'react-qr-reader';
import {axiosJWT} from '../componente/axiosJWT'

const Scanare = ()  => {
    let navigate = useNavigate();
    const [codQRScanat,setcodQRScanat] = useState(null);
    const [codQRValabilitate,setCodQRValabilitate] = useState(null);
    const [dataSiOraVerificarii,setDataSiOraVerificarii] = useState(null);
    const [numarMijlocDeTransport,setNumarMijlocDeTransport] = useState(null);
    const [numarRuta,setNumarRuta] = useState(null);
    const [scanat,setScanat] = useState(false);

    useEffect(() => {
        if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
        {
            navigate('/');
        }
    }, [navigate]);

    const handleScanare=async (props)=>{
      setcodQRScanat(props)
      
      try {
        const config = {
          headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        const {data} = await axiosJWT.post('http://localhost:3001/private/vanzariCodQr',{codQrDecodat:props},config);

        if(data.verificat === true && data.expirat === false && data.activ===true && data.anulat ===false)
        {
          setCodQRValabilitate("Acest bilet a fost deja verificat astazi!");
          setDataSiOraVerificarii(data.data_si_ora_cursei);
          setNumarMijlocDeTransport(data.numarul_mijlocului_de_transport);
          setNumarRuta(data.ruta_cursei);
        }
        else if(data.activ===true && data.expirat===false&& data.anulat ===false)
        {
          setCodQRValabilitate("Acest bilet/abonament este valabil!");
          if(data.tip==="bilet")
          {
            const date =new Date();
            const data_si_ora_cursei = new Date(date.getFullYear(),date.getMonth(), date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
            const data_si_ora_curseiISO = new Date(data_si_ora_cursei.getTime() - data_si_ora_cursei.getTimezoneOffset() * 60000);
            const numarul_mijlocului_de_transport ="Numar test";
            const ruta_cursei = "Ruta test";
            try {
              await axiosJWT.post('http://localhost:3001/private/vanzariBiletVerificat',{codQrDecodat:props,data_si_ora_cursei:data_si_ora_curseiISO,numarul_mijlocului_de_transport:numarul_mijlocului_de_transport,ruta_cursei:ruta_cursei},config);
            } catch (error) {
              console.log(error)
            }
          }
        }
        else
        {
          setCodQRValabilitate("Acest bilet/abonament este expirat, anulat sau nevalidat!");
        }
      } catch (error) {
        console.log(error)
      }
      setScanat(true);
    }

  return (
    <ContainerPagina>
      <div >
        <h1>Scanare</h1>
        {!scanat && <div style={{width:"500px"}}>
          <QrReader
          onResult={(result, error) => {
          if (!!result) {
            handleScanare(result?.text);
          }

          if (!!error) {
            console.log(error);
          }
        }}
        style={{width:"100%"}}
          />
        </div>}
        {scanat&&<button onClick={()=>{setScanat(false);setcodQRScanat(null);setCodQRValabilitate(null);setDataSiOraVerificarii(null);setNumarMijlocDeTransport(null);setNumarRuta(null)}}>Scaneaza din nou!</button>}
        <h1>Rezultat scanare:</h1>
        <h1>{codQRScanat}</h1>
        <h1>{codQRValabilitate}</h1>
        <h1>{dataSiOraVerificarii}</h1>
        <h1>{numarMijlocDeTransport}</h1>
        <h1>{numarRuta}</h1>
      </div>
    </ContainerPagina>
  );
}

export default Scanare;
