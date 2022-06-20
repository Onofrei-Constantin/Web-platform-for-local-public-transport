import React,{useState,useEffect,useRef} from "react";
import Email from '../assets/header/email.svg';
import Limba from '../assets/header/language.svg';
import Telefon from '../assets/header/telefon.svg';
import Rom from '../assets/header/ro.svg';
import Eng from '../assets/header/gb.svg';
import '../css/header.css'
import i18next from "i18next";


const Header = ()  => {
  const[arataMeniuDrop,setArataMeniuDrop] = useState(false);
  const lngRef= useRef();

  useEffect(()=>{
    const closeMeniu = e =>{
      if(e.path[0]!==lngRef.current)
      {
        setArataMeniuDrop(false);
      }
    };

    document.body.addEventListener('click',closeMeniu);

    return () =>document.body.removeEventListener('click',closeMeniu);
  },[])


  function renderMeniuLimbaDrop () {
    return(
    <div className="header-drop-container" onClick={()=>setArataMeniuDrop(false)} > 
      <div className="header-drop-content" onClick={()=>i18next.changeLanguage('ro')}>
        <img src={Rom} alt="" className="header-drop-flag"/>
        <p className="header-drop-p">
          Romana
        </p>
      </div>
      <hr className="header-drop-hr"/>
      <div className="header-drop-content" onClick={()=>i18next.changeLanguage('en')}>
        <img src={Eng} alt="" className="header-drop-flag"/>
        <p className="header-drop-p">
          English
        </p>   
      </div>          
    </div>
    );
  }


  return (
    <>
    <div className="header-container">
      <div className="header-content">
        <img src={Telefon} alt="" className="header-img"/>
        <p className="header-p">0330 401 442</p>
      </div>
      <div className="header-content">
        <img src={Email} alt="" className="header-img"/>
        <a href="mailto:contact@tpl-sv.ro" className="header-email">
            contact@tpl-sv.ro
        </a>
      </div>
      <img src={Limba} alt="" className="header-lang" ref={lngRef} onClick={()=>setArataMeniuDrop(!arataMeniuDrop)} />
      {arataMeniuDrop&&renderMeniuLimbaDrop()}
    </div>
    <hr className="header-hr"></hr>
    </>
  );
}

export default Header;
