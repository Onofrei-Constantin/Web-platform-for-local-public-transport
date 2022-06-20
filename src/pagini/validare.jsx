import React,{useState,useEffect,useContext} from "react";
import ContainerPagina from "../componente/containerPagina";
import {useNavigate,useLocation} from 'react-router-dom';
import {UserContext} from "../componente/UserContext";
import {axiosJWT} from "../componente/axiosJWT";

const Validare = ()  => {
    let navigate = useNavigate();
    const {state} = useLocation();
    const [seIncarca, setSeIncarca] = useState(true);
    const [idTranzactie,setIdTranzactie]=useState(null);
    const [tipPersoana,setTipPersoana] = useState(null);
    const[imagineUnu,setImagineUnu] = useState(null);
    const[imagineDoi,setImagineDoi] = useState(null);
    const[imagineTrei,setImagineTrei] = useState(null);
    const {user} = useContext(UserContext);

    useEffect(() => {
        if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
        {
            navigate('/');
        }
    }, [navigate]);

    useEffect(()=>{
        if(state!=null)
        {
            const { idTranzactie,tipPersoana } = state;
            setIdTranzactie(idTranzactie);
            setTipPersoana(tipPersoana);
            setSeIncarca(false);
        }
    },[state]);


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

    const fileSelectedHandlerUnu = (event)=>
    {
        if(event.target.files && event.target.files.length>0)
            {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.addEventListener("load", ()=>{
                setImagineUnu(reader.result);
            })
        }
    } 

    const fileSelectedHandlerDoi = (event)=>
    {
        if(event.target.files && event.target.files.length>0)
            {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.addEventListener("load", ()=>{
                setImagineDoi(reader.result);
            })
        }
    } 

    const fileSelectedHandlerTrei = (event)=>
    {
        if(event.target.files && event.target.files.length>0)
            {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.addEventListener("load", ()=>{
                setImagineTrei(reader.result);
            })
        }
    } 


    const fileUploadHandler = async () =>{

        const config = {
            headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        };

        const imagini = [imagineUnu,imagineDoi,imagineTrei];

        console.log(imagini)

        try {
            await axiosJWT.post('http://localhost:3001/private/validariAdauga',{user:user.user,idTranzactie:idTranzactie,imagini:imagini},config)

            await axiosJWT.post('http://localhost:3001/private/vanzariCerereValidare/'+idTranzactie)

            navigate('/informatii-utilizator');
        } catch (error) {
            console.log(error)
        }
    }



  return (
    <ContainerPagina>
      <div>
        <h1>{tipPersoana==="normal" && "Pentru a valida acest abonament trebuie sa trimiteti poze cu buletinul(fata/spate)"}</h1>
        <h1>{tipPersoana==="elev" && "Pentru a valida acest abonament trebuie sa trimiteti poze cu buletinul(fata/spate), adeverinţă de elev/student pe anul şcolar în curs"}</h1>

        <div>
            {tipPersoana==="normal" &&
                <>
                <input type="file" onChange={fileSelectedHandlerUnu}/>
                <input type="file" onChange={fileSelectedHandlerDoi}/>
                <button onClick={fileUploadHandler}>Trimite cerere</button>
                <img src={imagineUnu} alt="" style={{width:"500px"}}/>
                <img src={imagineDoi} alt="" style={{width:"500px"}}/>
                </>
            }

            {tipPersoana==="elev" &&
                <>
                <input type="file" onChange={fileSelectedHandlerUnu}/>
                <input type="file" onChange={fileSelectedHandlerDoi}/>
                <input type="file" onChange={fileSelectedHandlerTrei}/>
                <button onClick={fileUploadHandler}>Trimite cerere</button>
                <img src={imagineUnu} alt="" style={{width:"500px"}}/>
                <img src={imagineDoi} alt="" style={{width:"500px"}}/>
                <img src={imagineTrei} alt="" style={{width:"500px"}}/>
                </>
            }

        </div>
      </div>
    </ContainerPagina>
  );
}

export default Validare;
