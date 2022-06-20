import React,{useState,useEffect} from "react";
import {useNavigate,useLocation} from 'react-router-dom';
import ContainerPagina from "../componente/containerPagina";
import { axiosJWT } from "../componente/axiosJWT";


const ConfirmareValidare = ()  => {
    let navigate = useNavigate();
    const {state} = useLocation();
    const [seIncarcaState, setSeIncarcaState] = useState(true);
    const [seIncarcaData1, setSeIncarcaData1] = useState(true);
    const [seIncarcaData2, setSeIncarcaData2] = useState(true);
    const [idTranzactieState,setIdTranzactieState]=useState(null);
    const [userState,setUserState] = useState(null);
    const [imaginiState, setImaginiState] = useState(null);
    const [vanzare,setVanzare] = useState(null);
    const [user,setUser] = useState(null);

    useEffect(() => {
        if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
        {
            navigate('/');
        }
    }, [navigate]);


    useEffect(()=>{
        if(state!=null)
        {
            const { user,idTranzactie,imagini } = state;
            setUserState(user);
            setIdTranzactieState(idTranzactie);
            setImaginiState(imagini);
            setSeIncarcaState(false);
        }
    },[state]);

    useEffect(()=>{

        if(idTranzactieState!=null && userState !=null){

        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };

        const getVanzare = async ()=>{     

        await axiosJWT.get('http://localhost:3001/private/vanzariId/'+idTranzactieState,config)
            .then(response=>{ 
                if(response.data.length>0)
                {
                  setVanzare(response.data[0]);
                }
                setSeIncarcaData1(false);
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

        const getUser = async ()=>{     

        await axiosJWT.get('http://localhost:3001/auth/gasireUtilizator/'+userState,config)
            .then(response=>{ 
                if(response.data.length>0)
                {
                  setUser(response.data[0]);
                }
                setSeIncarcaData2(false);
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

        
        getVanzare();
        getUser();
        }
    },[idTranzactieState,userState])

    if(seIncarcaState||seIncarcaData1||seIncarcaData2)
    {
        return (
        <ContainerPagina>
            <div >
                <h1>Se incarca datele...</h1>
            </div>
        </ContainerPagina>
        );
    }


    const handleValideaza = async ()=>{
        let dataStart;
        let dataStop;
        let dataStartISO;
        let dataStopISO;
        const date = new Date();
        switch (vanzare.valabilitateTip) {
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
                    dataStop = new Date(date.getFullYear(),date.getMonth(), date.getDate()+vanzare.perioada-1);  
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
            await axiosJWT.post('http://localhost:3001/private/validariValideaza/'+idTranzactieState,config);
            
            await axiosJWT.post('http://localhost:3001/private/vanzariValidare',{id:idTranzactieState,dataStart:dataStartISO,dataStop:dataStopISO},config);

            axiosJWT.post('http://localhost:3001/send_mail_validare',{subiect:"Validare completa",email:userState,mesaj:"Cererea dvs. de validare a abonamentului cu id " + idTranzactieState + " a fost completata"});
            
            navigate('/validari');
        } catch (error) {
            console.log(error);
        }
    }

    const handleAnuleaza = async ()=>{
        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };
        if(vanzare.pret===0)
        {
            try {
                await axiosJWT.post('http://localhost:3001/private/vanzariAnuleaza/'+idTranzactieState);
                
                await axiosJWT.post('http://localhost:3001/private/validariAnuleaza/'+idTranzactieState,config);

                axiosJWT.post('http://localhost:3001/send_mail_validare',{subiect:"Abonament anulat",email:userState,mesaj:"Cererea dvs. de validare a abonamentului cu id " + idTranzactieState + " a fost anulata impreuna cu abonamentul."});

                navigate('/validari');
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

                await axiosJWT.post('http://localhost:3001/private/cancelPayment',{payment_intent:vanzare.idPayment},config)
                
                await axiosJWT.post('http://localhost:3001/private/vanzariAnuleaza/'+idTranzactieState);

                await axiosJWT.post('http://localhost:3001/private/validariAnuleaza/'+idTranzactieState,config);

                axiosJWT.post('http://localhost:3001/send_mail_validare',{subiect:"Abonament anulat",email:userState,mesaj:"Cererea dvs. de validare a abonamentului cu id " + idTranzactieState + " a fost anulata impreuna cu abonamentul."});

                navigate('/validari');
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleDateEronate = async ()=>{
        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };

        try {
            await axiosJWT.post('http://localhost:3001/private/validariAnuleaza/'+idTranzactieState,config);
            
            await axiosJWT.post('http://localhost:3001/private/vanzariCerereValidareAnuleaza/'+idTranzactieState,config);

            axiosJWT.post('http://localhost:3001/send_mail_validare',{subiect:"Date validare gresite",email:userState,mesaj:"Cererea dvs. de validare a abonamentului cu id " + idTranzactieState + " a fost anulata pentru ca ati trimis date de validare gresite."});

            navigate('/validari');
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <ContainerPagina>
      <div >
        <h1>ConfirmareValidare</h1>
        <h1>Date user :</h1>
        <h2>{user.email}</h2>
        <h2>{user.cnp}</h2>
        <h1>Date bilet vandut:</h1>
        <h2>{vanzare._id}</h2>
        <h2>{vanzare.tip}</h2>
        <h2>{vanzare.pret}</h2>
        <h1>Date cerere validare:</h1>
        <h2>{userState}</h2>
        <h2>{idTranzactieState}</h2>
        <img src={imaginiState[0]} alt="" style={{width:"500px"}}/>
        <img src={imaginiState[1]} alt="" style={{width:"500px"}}/>
        <img src={imaginiState[2]} alt="" style={{width:"500px"}}/>
        <button onClick={()=>handleValideaza()}>Valideaza</button>
        <button onClick={()=>handleAnuleaza()}>Anuleaza</button>
        <button onClick={()=>handleDateEronate()}>Date eroanate</button>
      </div>
    </ContainerPagina>
  );
}

export default ConfirmareValidare;
