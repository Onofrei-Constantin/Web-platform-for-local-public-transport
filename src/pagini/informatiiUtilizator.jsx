import { axiosJWT } from "../componente/axiosJWT";
import React,{useEffect,useContext,useState} from "react";
import {useNavigate } from 'react-router-dom';
import ContainerPagina from "../componente/containerPagina";
import { UserContext } from "../componente/UserContext";
import {ProdusContext } from "../componente/ProdusContext";
import {AbonamentContext} from "../componente/AbonamentContext";
import PopupQR from "../componente/popupQR";
import QRcod from 'qrcode';

    const InformatiiUtilizator = ()  => {
    let navigate = useNavigate();
    const {user} = useContext(UserContext);
    const {abonament,setAbonament} = useContext(AbonamentContext);
    const {setProdus} = useContext(ProdusContext);
    const [seIncarca, setSeIncarca] = useState(true);
    const [abonamente,setAbonamente] = useState(null);
    const [buttonPopUp,setButtonPopUp] = useState(false);
    const [codQr,setCodQr] = useState(null);
    const [codQrPopUp,setCodQrPopUp] = useState(null);
    

    useEffect(() => {
    if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
    {
      navigate('/')
    }
    }, [navigate]);

    useEffect(()=>{
        function generateQR()
        {
            QRcod.toDataURL(codQr).then((data)=>{
                setCodQrPopUp(data);
            });
        }
        
        if(codQr!=null)
        {
            generateQR();
        }
    },[codQr]);

    useEffect(()=>{
        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };

        const getAbonamentUser = async ()=>{ 

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

        const getAbonamenteUser = async ()=>{

        await axiosJWT.get('http://localhost:3001/private/vanzariUtilizator/'+user.user,config)
            .then(response=>{ 
                if(response.data.length>0)
                {
                  setAbonamente(response.data);
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

        getAbonamenteUser();
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

    function afisareBilete(info){
        return info.filter(el=>el.tip==="bilet").sort((el1,el2)=>{return (el1.activ > el2.activ) ? -1 : 1}).map((el,index)=>{
            return(
                <div key={index}>
                    <h3>{el.idTranzactie}</h3>
                    <h3>{el.user}</h3>
                    <h3>{el.tip}</h3>
                    <h3>{el.nominal}</h3>
                    <h3>{el.pret}</h3>
                    <h3>{el.activ.toString()}</h3>
                    <h3>{el.cerereValidare.toString()}</h3>
                    <h3>{el.expirat.toString()}</h3>
                    <h3>{el.anulat.toString()}</h3>
                    <h3>{el.tipPersoana}</h3>
                    <button className="" onClick={()=>{setCodQr(el.codQrDecodat);setButtonPopUp(true)}}>Vezi cod QR</button>
                </div>
            );
        })
    }

    function afisareAbonamenteNominale(info){
        return info.filter( el=>el.tip==="abonament"&&el.nominal==="nominal").sort((el1,el2)=>{return (el1.activ > el2.activ) ? -1 : 1}).map((el,index)=>{
            return(
                <div key={index}>
                    <h3>{el.idTranzactie}</h3>
                    <h3>{el.user}</h3>
                    <h3>{el.tip}</h3>
                    <h3>{el.nominal}</h3>
                    <h3>{el.pret}</h3>
                    <h3>{el.activ.toString()}</h3>
                    <h3>{el.cerereValidare.toString()}</h3>
                    <h3>{el.expirat.toString()}</h3>
                    <h3>{el.anulat.toString()}</h3>
                    <h3>{el.tipPersoana}</h3>
                    {(el.expirat===false&&el.activ===false&&el.anulat===false&&el.cerereValidare===false) &&<button className="" onClick={()=>handleAnulare({pret:el.pret,id:el._id,idPayment:el.idPayment})}>Anuleaza abonament</button>} 
                    {(el.expirat===false&&el.activ===false&&el.anulat===false&&el.cerereValidare===false) &&<button className="" onClick={()=>handleValidare({idTranzactie:el._id,tipPersoana:el.tipPersoana})}>Valideaza abonament</button>}
                    {(el.expirat===true&&el.activ===false&&el.anulat===false&&el.inVanzare===true&&abonament==null) &&<button className="" onClick={()=>handleReinoire(el.idBilet)}>Reinoieste abonament</button>}
                    <button className="" onClick={()=>{setCodQr(el.codQrDecodat);setButtonPopUp(true)}}>Vezi cod QR</button>
                </div>
            );
        })
    }

    function afisareAbonamenteNenominale(info){
        return info.filter(el=>el.tip==="abonament"&&el.nominal==="nenominal").sort((el1,el2)=>{return (el1.activ > el2.activ) ? -1 : 1}).map((el,index)=>{
            return(
                <div key={index}>
                    <h3>{el.idTranzactie}</h3>
                    <h3>{el.user}</h3>
                    <h3>{el.tip}</h3>
                    <h3>{el.nominal}</h3>
                    <h3>{el.pret}</h3>
                    <h3>{el.activ.toString()}</h3>
                    <h3>{el.cerereValidare.toString()}</h3>
                    <h3>{el.expirat.toString()}</h3>
                    <h3>{el.anulat.toString()}</h3>
                    <h3>{el.tipPersoana}</h3>
                    <button className="" onClick={()=>{setCodQr(el.codQrDecodat);setButtonPopUp(true)}}>Vezi cod QR</button>
                </div>
            );
        })
    }

    async function handleAnulare(props){
        const {pret,id,idPayment} = props;

        if(pret===0)
        {

            try {
                await axiosJWT.post('http://localhost:3001/private/vanzariAnuleaza/'+id);
                navigate('/rambursare');
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
                
                await axiosJWT.post('http://localhost:3001/private/vanzariAnuleaza/'+id);

                navigate('/rambursare');
            } catch (error) {
                console.log(error)
            }
        }
    }

    function handleValidare(props){
        const {idTranzactie,tipPersoana} = props;
        navigate('/validare',{state:{idTranzactie:idTranzactie,tipPersoana:tipPersoana}});
    }

    async function handleReinoire(props) {
        try {
            const config = {
                    headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
            };

            const {data} = await axiosJWT.post('http://localhost:3001/private/bileteGaseste',{id:props},config);
            setProdus(data);
            navigate('/checkout');
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <ContainerPagina>
      <div >
        <h1>Informatii Utilizator</h1>
        <h1>Abonamente nominale</h1>
        {afisareAbonamenteNominale(abonamente||[])}
        <h1>Abonamente nenominale</h1>
        {afisareAbonamenteNenominale(abonamente||[])}
        <h1>Bilete</h1>
        {afisareBilete(abonamente||[])}
      </div>
      <PopupQR trigger={buttonPopUp} setTrigger={setButtonPopUp}>
        <h1>Codul QR este</h1>
        <img src={codQrPopUp} alt=''/>
      </PopupQR>
    </ContainerPagina>
  );
}

export default InformatiiUtilizator;
