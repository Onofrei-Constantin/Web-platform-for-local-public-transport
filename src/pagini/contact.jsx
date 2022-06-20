import React, { useRef, useState } from "react";
import ContainerPagina from "../componente/containerPagina";
import ReCaptcha from 'react-google-recaptcha';
import axios from "axios";

const Contact = ()  => {

  const refReCaptcha = useRef(null);
  const[valReCaptcha,setValReCaptcha] = useState(null);
  const[subiect,setSubiect] = useState(false);
  const[nume,setNume] = useState(false);
  const[email,setEmail] = useState(false);
  const[telefon,setTelefon] = useState(false);
  const[mesaj,setMesaj] = useState(false);
  const[seTrimite,setSeTrimite] = useState(false);

  const handleSend =async (e) =>{
    e.preventDefault();

    if(valReCaptcha)
    {
      try {
        setSeTrimite(true);
        await axios.post('http://localhost:3001/send_mail_contact',{subiect,nume,email,telefon,mesaj});
        refReCaptcha.current.reset();
        setValReCaptcha(false);
        setSeTrimite(false);
      } catch (error) {
        console.log(error)
      }
      
    }
    else{
      console.log("Nu sa bifat reC...")
    }
  }

  return (
    <ContainerPagina>
      <div >
        <h1>Contact</h1>
        <form onSubmit={handleSend}> 
          <input type="text" placeholder="Subiect" id="subiect" required onChange={(e)=>setSubiect(e.target.value)}/>
          <input type="text" placeholder="Nume si Prenume" id="nume" required onChange={(e)=>setNume(e.target.value)}/>
          <input type="email" placeholder="Email" id="email" required onChange={(e)=>setEmail(e.target.value)}/>
          <input type="tel" placeholder="Telefon" id="telefon" required onChange={(e)=>setTelefon(e.target.value)}/>
          <input type="textarea" placeholder="Mesajul dumneavostra" id="mesaj" required onChange={(e)=>setMesaj(e.target.value)}/>
          <ReCaptcha
            ref={refReCaptcha}
            className="ReCaptcha"
            sitekey="6Lcew_8eAAAAAJzEW0a13yHadjKcOMzXRmwbmYBX"
            onChange={()=>setValReCaptcha(true)}
          ></ReCaptcha>
          <button type="submit" disabled={seTrimite}>Trimite</button>
        </form>
      </div>
    </ContainerPagina>
  );
}

export default Contact;
