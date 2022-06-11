import React,{useEffect, useState,useContext} from "react";
import {Link,useNavigate} from 'react-router-dom';
import '../css/navigare.css';
import Meniu from '../assets/navigare/meniu.svg';
import Inchide from '../assets/navigare/inchide.svg';
import SageataJos from '../assets/navigare/sageataJos.svg';
import Logo from '../assets/navigare/logoTPL.png';
import {dataDM1} from '../data/dataDM1';
import axios from "axios";
import jwt_decode from 'jwt-decode';
import { UserContext } from "./UserContext";
import { AbonamentContext } from "./AbonamentContext";
import { ProdusContext } from "./ProdusContext";
import { axiosJWT } from "./axiosJWT";


const Navigare = ()  => {

  const [meniuDeschis, setMeniuDeschis] = useState(false);
  const [arataMeniuMobil, setArataMeniuMobil] = useState(false);
  const [arataMeniuDrop1, setArataMeniuDrop1] = useState(false);
  const [arataMeniuDrop2, setArataMeniuDrop2] = useState(false);
  const {setUser} = useContext(UserContext);
  const {setAbonament} = useContext(AbonamentContext);
  const {setProdus} = useContext(ProdusContext);
  const navigate = useNavigate();

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


  const refreshToken = async ()=>{
    try {
      const res = await axios.post("http://localhost:3001/auth/refresh",{token : localStorage.getItem("authRefreshToken")})
      localStorage.setItem("authToken", res.data.accessToken)
      localStorage.setItem("authRefreshToken", res.data.refreshToken)
      return res.data;
    } catch (error) {
      console.log(error)
    }
  }

  axiosJWT.interceptors.request.use(
    async (config) =>{
      let currentDate = new Date();
      const decodedToken = jwt_decode(localStorage.getItem("authToken"))
      
      if(decodedToken.exp * 1000 < currentDate.getTime())
      {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },(error)=>{
      return Promise.reject(error);
    }
  );


  const logoutHandler = async () =>{
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      if(localStorage.getItem("authToken")||localStorage.getItem("authRefreshToken")){
        await axiosJWT.post("http://localhost:3001/auth/logout",{token : localStorage.getItem("authRefreshToken")},config)
        localStorage.removeItem("authToken");
        localStorage.removeItem("authRefreshToken");
        localStorage.removeItem("userValue");
        localStorage.removeItem("produsValue");
        localStorage.removeItem("abonamentValue");
        setUser({user:null,cnp:null});
        setAbonament(null);
        setProdus(null);
        window.location.reload();
      }
  }

  
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

        <button className="" onClick={()=>navigate('/login')} > Login
        </button>
         <button className="" onClick={()=>navigate('/informatii-utilizator')} > Profil
        </button>    
        <button className="" onClick={()=>navigate('/inregistrare')} > Register
        </button>   
        <button className="" onClick={logoutHandler} > Logout
        </button>      
    </nav>
    </>
  );
}

export default Navigare;
