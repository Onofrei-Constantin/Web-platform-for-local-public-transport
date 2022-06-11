import React,{useContext,useEffect,useState} from "react";
import {useNavigate } from 'react-router-dom';
import ContainerPagina from "../componente/containerPagina";
import { ProdusContext } from "../componente/ProdusContext";
import { UserContext } from "../componente/UserContext";
import { AbonamentContext } from "../componente/AbonamentContext";
import { useStripe } from "@stripe/react-stripe-js";
import { axiosJWT } from "../componente/axiosJWT";
import QRCode from 'qrcode';


const Checkout = ()  => {
    let navigate = useNavigate();
    const {produs} = useContext(ProdusContext);
    const {user} = useContext(UserContext);
    const {abonament} = useContext(AbonamentContext);

    const [idReinoire,setIdReinoire] = useState(null);
    const [pret,setPret] = useState(null);
    const [numeBilet,setNumeBilet] = useState(null);
    const [valabilitateInfo,setValabilitateInfo] = useState(null);
    const [tipImagine,setTipImagine] = useState(null);
    const [valabilitateTip,setValabilitateTip] = useState(null);
    const [activ,setActiv] = useState(null);
    const [nominal,setNominal] = useState(null);
    const [perioada,setPerioada] = useState(null);
    const [tipBilet,setTipBilet]= useState(null);
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
        if(produs!=null)
        {
            const {pret,numeBilet,valabilitateInfo,tipImagine,valabilitateTip,tip,activ,perioada,_id,reinoire,tipBilet} = produs;
            setPret(pret);
            setNumeBilet(numeBilet);
            setValabilitateInfo(valabilitateInfo);
            setTipImagine(tipImagine);
            setValabilitateTip(valabilitateTip);
            setActiv(activ);
            setNominal(tip);
            setPerioada(perioada);
            setTipBilet(tipBilet);
            if(reinoire===true)
            {
                setIdReinoire(_id);
            }
            else
            {
                setIdReinoire(null);
            }
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
                    images: [tipImagine==='bilet' ? urlBilet : urlAbonament],
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

        if(idReinoire!==null)
        {
            metadata = {'dataStart':dataStartISO,'dataStop':dataStopISO,'idReinoire':idReinoire}
        }
        else
        {
            let cnp;
            if(nominal==="nominal")
            {
                cnp = user.cnp;
            }
            else
            {
                cnp = null;
            }
            metadata = {'activ':activ,'tip':nominal,'dataStart':dataStartISO,'dataStop':dataStopISO,'tipImagine':tipImagine,'valabilitateTip':valabilitateTip,'perioada':perioada,'tipBilet':tipBilet,'cnp':cnp}
        }

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

        if(idReinoire!==null)
        {
            try {
                await axiosJWT.post("http://localhost:3001/private/vanzariReinoire/"+idReinoire,{
                dataStart: dataStartISO,
                dataStop: dataStopISO,
                })
                navigate('/success');
            } catch (error) {
                console.log("Eroare: "+error);
            } 
        }
        else{
            let qr;
            let cnp;
            if(nominal==="nominal")
            {
                cnp = user.cnp;
                qr = await QRCode.toDataURL(cnp+""+Date.now() +""+ Math.floor(100000 + Math.random() * 900000));
            }
            else
            {
                cnp = null;
                qr = await QRCode.toDataURL(Math.floor(1000000000000 + Math.random() * 9000000000000)+""+Date.now() +""+ Math.floor(100000 + Math.random() * 900000));
            }

            try {
                await axiosJWT.post("http://localhost:3001/private/vanzariAdauga",{
                numeBilet: numeBilet,
                pret: pret,
                dataStart: dataStartISO,
                dataStop: dataStopISO,
                codQR : qr,
                user: user.user,
                tip: nominal,
                activ: activ,
                tipImagine: tipImagine,
                valabilitateTip: valabilitateTip,
                perioada: perioada,
                tipBilet: tipBilet,
                cnp: cnp,
                })
                navigate('/success');
            } catch (error) {
                console.log("Eroare: "+error);
            } 
        }
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
