import React,{useContext,useEffect,useState} from "react";
import {useNavigate } from 'react-router-dom';
import ContainerPagina from "../componente/containerPagina";
import { ProdusContext } from "../componente/ProdusContext";
import { UserContext } from "../componente/UserContext";
import { AbonamentContext } from "../componente/AbonamentContext";
import { useStripe } from "@stripe/react-stripe-js";
import { axiosJWT } from "../componente/axiosJWT";

const Checkout = ()  => {
    let navigate = useNavigate();
    const {produs} = useContext(ProdusContext);
    const {user} = useContext(UserContext);
    const {abonament,setAbonament} = useContext(AbonamentContext);

    const [pret,setPret] = useState(null);
    const [numeBilet,setNumeBilet] = useState(null);
    const [valabilitateInfo,setValabilitateInfo] = useState(null);
    const [tip,setTip] = useState(null);
    const [valabilitateTip,setValabilitateTip] = useState(null);
    const [activ,setActiv] = useState(null);
    const [nominal,setNominal] = useState(null);
    const [perioada,setPerioada] = useState(null);
    const [tipPersoana,setTipPersoana]= useState(null);
    const [idBilet,setIdBilet] = useState(null);
    const [seIncarca, setSeIncarca] = useState(true);
    const stripe = useStripe();

    const urlBilet = "https://toppng.com/uploads/preview/tiket-11550724558kfzqgsywhm.png" ;
    const urlAbonament = "https://static.thenounproject.com/png/114730-200.png";

    useEffect(() => {
        if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
        {
            navigate('/tarife');
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

    useEffect(()=>{
        if(produs!=null)
        {
            const {_id,pret,numeBilet,valabilitateInfo,tip,valabilitateTip,nominal,activ,perioada,tipPersoana} = produs;
            setNumeBilet(numeBilet);
            setValabilitateInfo(valabilitateInfo);
            setTip(tip);
            setValabilitateTip(valabilitateTip);
            setActiv(activ);
            setNominal(nominal);
            setPerioada(perioada);
            setTipPersoana(tipPersoana);
            setPret(pret);
            setIdBilet(_id);
        }
    },[produs]);


    const handleClientCheckout = ()=>{
        const line_items = [{
            quantity:1,
            price_data: {
                currency: 'ron',
                unit_amount: pret * 100,
                product_data: {
                    name : numeBilet,
                    description : valabilitateInfo,
                    images: [tip==='bilet' ? urlBilet : urlAbonament],
                }
            },
        }];

        let dataStart;
        let dataStop;
        let dataStartISO;
        let dataStopISO;
        const date = new Date();

        if(activ===true)
        {
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
        }
        else{
            dataStartISO = null;
            dataStopISO = null;
        }


        let metadata;
        let cnp;
        if(nominal==="nominal")
        {
            cnp = user.cnp;
        }
        else
        {
            cnp = null;
        }
        metadata = {'activ':activ,'nominal':nominal,'dataStart':dataStartISO,'dataStop':dataStopISO,'tip':tip,'valabilitateTip':valabilitateTip,'perioada':perioada,'tipPersoana':tipPersoana,'cnp':cnp,'idBilet':idBilet}
        

        const fetchFromCheckout = async () => {
            const config = {
                headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            };

            
            const response = await axiosJWT.post("http://localhost:3001/private/checkout",{line_items,customer_email:user.user,metadata},config);
            
            const {sessionId} = response.data;
            
            const {error} =  await stripe.redirectToCheckout({sessionId})

            if(error)
            {
                console.log(error)
            }
            
        };

        fetchFromCheckout();
    }

    const handleElevCheckout = async ()=>{

        let dataStart;
        let dataStop;
        let dataStartISO;
        let dataStopISO;
        const date = new Date();

        if(activ===true)
        {
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
        }
        else{
            dataStartISO = null;
            dataStopISO = null;
        }

        
        
            let qr;
            let cnp;
            if(nominal==="nominal")
            {
                cnp = user.cnp;
                qr = cnp+""+Date.now() +""+ Math.floor(10000000000000 + Math.random() * 90000000000000);
            }
            else
            {
                cnp = null;
                qr = Math.floor(1000000000000 + Math.random() * 9000000000000)+""+Date.now() +""+ Math.floor(10000000000000 + Math.random() * 90000000000000);
            }

            console.log(qr)

            try {
                await axiosJWT.post("http://localhost:3001/private/vanzariAdauga",{
                numeBilet: numeBilet,
                pret: pret,
                dataStart: dataStartISO,
                dataStop: dataStopISO,
                user: user.user,
                nominal: nominal,
                activ: activ,
                tip: tip,
                valabilitateTip: valabilitateTip,
                perioada: perioada,
                tipPersoana: tipPersoana,
                cnp: cnp,
                idBilet:idBilet,
                pretReinoire: pret,
                codQrDecodat:qr,
                })
                navigate('/success');
            } catch (error) {
                console.log("Eroare: "+error);
            } 
        
    }

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
                <h1>Checkout</h1>
                {(abonament==null||nominal!=="nominal") ? (
                    <>
                        <h2>{`Sunte-ti logat cu userul: ${user.user}`}</h2>
                        <h2>{`Ati selectat: ${numeBilet}`}</h2>
                        <h2>{`Cu pretul: ${pret} Lei`}</h2>
                        <h2>{valabilitateTip==="luna" && "Acest abonament va fi valabil pe o durata de 30 de zile!"}</h2>
                        <h2>{activ===true ? "Acest abonament va deveni activ in momentul confirmarii platii" : "Acest abonament va deveni activ pe o durata de 30 de zile in urma validarii. Acest lucru poate dura 2-3 zile."}</h2>
                        <h2>{valabilitateTip==="zile" && `Acest abonament va fi valabil din ziua in care a fost achiziotionat pe un timp de ${valabilitateInfo}!`}</h2>
                        <h2>{valabilitateTip==="zi" && "Acest bilet va fi valabil doar in ziua in care a fost cumparat!"}</h2>
                        <button onClick={pret===0 ? handleElevCheckout : handleClientCheckout}>Finalizeaza achizitia</button> 
                    </>
                ):(<h2>{"Aveti un abonament nominal care nu e expirat. Nu mai puteti cumpara altul cat timp acesta este expirat sau anulat. Pentru a cumpara unul nou va rugam sa il anulati pe cel vechi."}</h2>)} 
            </div>
        </ContainerPagina>
    );
}

export default Checkout;
