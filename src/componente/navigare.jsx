import React,{useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import '../css/navigare.css';
import Meniu from '../assets/navigare/meniu.svg';
import Inchide from '../assets/navigare/inchide.svg';
import SageataJos from '../assets/navigare/sageataJos.svg';
import Logo from '../assets/navigare/logoTPL.png';
import {dataDM1} from '../data/dataDM1';


const Navigare = ()  => {

  const [meniuDeschis, setMeniuDeschis] = useState(false);
  const [arataMeniuMobil, setArataMeniuMobil] = useState(false);
  const [arataMeniuDrop1, setArataMeniuDrop1] = useState(false);
  const [arataMeniuDrop2, setArataMeniuDrop2] = useState(false);

  

  function renderDM(info)
  {
    return (
    <ul className="navigare-drop">
      {info.map((el,index)=>{
        const { path, titlu} = el;
        return(<Link key={index} className="navigare-link-css-drop" to={path} onClick={()=>setMeniuDeschis(false)}>
        <li>
          {titlu}
        </li>
        </Link>)
      })}
    </ul>
    );
  }

  

  const onMouseEnter1 = () =>
  {
    if(window.innerWidth>780)
    {
      setArataMeniuDrop1(true);
    }
  }

  const onMouseEnter2 = () =>
  {
    if(window.innerWidth>780)
    {
      setArataMeniuDrop2(true);
    }
  }

  const onMouseLeave1 = () =>
  {
    if(window.innerWidth>780)
    {
      setArataMeniuDrop1(false);
    }
  }

  const onMouseLeave2 = () =>
  {
    if(window.innerWidth>780)
    {
      setArataMeniuDrop2(false);
    }
  }

  const onMobileDisplay1 = () =>{
    if(window.innerWidth<=780)
    {
      setArataMeniuDrop1(!arataMeniuDrop1);
      setArataMeniuDrop2(false);
    }
  }

  const onMobileDisplay2 = () =>{
    if(window.innerWidth<=780)
    {
      setArataMeniuDrop2(!arataMeniuDrop2);
      setArataMeniuDrop1(false);
    }
  }

  useEffect(()=>{
    const handleResize = () => {
      if(window.innerWidth>780)
      {
        setArataMeniuMobil(false);
        setMeniuDeschis(false);
      }
      else
      {
        setArataMeniuMobil(true); 
      }
    };

    window.addEventListener('resize',handleResize);

    return ()=>{
      window.removeEventListener('resize',handleResize);
    }

  },[]);

  

  return (
    <>
    <nav className="navigare-nav">
        <img src={Logo} alt="" className="navigare-logo"/>
        <ul className={meniuDeschis && arataMeniuMobil? "navigare-links-mobile" : "navigare-links"} >
            <Link className="navigare-link-css" to='/' onClick={()=> setMeniuDeschis(false)}>
              <li>Acasa</li>
            </Link>
            <Link className="navigare-link-css" to='/conduceretpl' onClick={()=> setMeniuDeschis(false)}>
              <li>Conducere TPL</li>
            </Link>
            <Link className="navigare-link-css" to='/rute' onClick={()=> setMeniuDeschis(false)}>
              <li>Rute</li>
            </Link>
            <Link className="navigare-link-css" to='/anunturi' onClick={()=> setMeniuDeschis(false)}>
              <li>Anunturi</li>
            </Link>
            <li className="navigare-link-css" onMouseEnter={onMouseEnter1} onMouseLeave={onMouseLeave1} onClick={onMobileDisplay1} >Contact<img src={SageataJos} alt="" />
              {arataMeniuDrop1  && renderDM(dataDM1)}
            </li>
            <li className="navigare-link-css" onMouseEnter={onMouseEnter2} onMouseLeave={onMouseLeave2} onClick={onMobileDisplay2}>Contact<img src={SageataJos} alt="" />
              {arataMeniuDrop2 && renderDM(dataDM1)} 
            </li>
        </ul>

        <button className="navigare-buton" onClick={()=> setMeniuDeschis(!meniuDeschis)} >
          {meniuDeschis && arataMeniuMobil ? <img src={Inchide} alt="" />  : <img src={Meniu} alt="" />} 
        </button>   
    </nav>
    </>
  );
}

export default Navigare;
