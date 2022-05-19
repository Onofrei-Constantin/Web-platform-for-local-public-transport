import React, { useRef, useState } from "react";
import ContainerPagina from "../componente/containerPagina";
import ReCaptcha from 'react-google-recaptcha';
import EmailJs from 'emailjs-com';


const Contact = ()  => {

  const refReCaptcha = useRef(null);
  const[valReCaptcha,setValReCaptcha] = useState(null);

  function handleSend(e){
    e.preventDefault();

    if(valReCaptcha)
    {
    EmailJs.sendForm('service_tpl_gmail','template_8x0btn8',e.target,'6hN-WdrTgQkcT3KCg')
    .then((result)=>{
      console.log(result.text);
      refReCaptcha.current.reset();
      setValReCaptcha(false);
    }, (error)=>{
      console.log(error.text);
    });
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
          <input type="text" placeholder="Subiect" name="subiect" required />
          <input type="text" placeholder="Nume si Prenume" name="nume" required />
          <input type="email" placeholder="Email" name="email" required />
          <input type="tel" placeholder="Telefon" name="telefon" required />
          <input type="textarea" placeholder="Mesajul dumneavostra" name="mesaj" required/>
          <ReCaptcha
            ref={refReCaptcha}
            className="ReCaptcha"
            sitekey="6Lcew_8eAAAAAJzEW0a13yHadjKcOMzXRmwbmYBX"
            onChange={()=>setValReCaptcha(true)}
          ></ReCaptcha>
          <button type="submit">Trimite</button>
        </form>
      </div>
    </ContainerPagina>
  );
}

export default Contact;
