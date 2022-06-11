import React,{useState, useEffect,useMemo} from "react";
import Acasa from './pagini/acasa';
import ConducereTPL from './pagini/conducereTPL';
import Contact from './pagini/contact';
import Galerie from './pagini/galerie';
import ParcAuto from './pagini/parcAuto';
import Navigare from './componente/navigare';
import Header from "./componente/header";
import Footer from './componente/footer';
import Rute from './pagini/rute';
import Tarife from './pagini/tarife';
import Login from './administrare/login';
import InregistrareAdministare from "./administrare/inregistrareAdministrare";
import PrivateRoute from "./administrare/privateRoute";
import AdmPage from "./administrare/admPage";
import CautareRute from "./componente/cautareRute";
import Anunturi from "./pagini/anunturi";
import Anunt from "./componente/anunt";
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import {UserContext} from './componente/UserContext';
import { ProdusContext } from "./componente/ProdusContext";
import { AbonamentContext } from "./componente/AbonamentContext";
import Success from "./componente/success";
import Cancel from "./componente/cancel";
import './componente/i18n';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Checkout from "./pagini/checkout";
import Inregistrare from "./pagini/inregistrare";
import InformatiiUtilizator from "./pagini/informatiiUtilizator";
import Rambursare from "./componente/rambursare";
import Validare from "./pagini/validare";


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  const [user,setUser] = useState({user:null,cnp:null});
  const [produs,setProdus] = useState(null);
  const [abonament,setAbonament] = useState(null);

  const userValue = useMemo(()=>({user,setUser}),[user,setUser]);
  const produsValue = useMemo(()=>({produs,setProdus}),[produs,setProdus]);
  const abonamentValue = useMemo(()=>({abonament,setAbonament}),[abonament,setAbonament]);

  useEffect(()=>{
    const dataUser = window.localStorage.getItem('userValue');
    const dataProdus = window.localStorage.getItem('produsValue');
    const dataAbonament = window.localStorage.getItem('abonamentValue');
    if(dataUser!==null) setUser(JSON.parse(dataUser))
    if(dataProdus!==null) setProdus(JSON.parse(dataProdus))
    if(dataAbonament!==null) setAbonament(JSON.parse(dataAbonament))
  },[])

  useEffect(()=>{
    window.localStorage.setItem('userValue',JSON.stringify(user))
    window.localStorage.setItem('produsValue',JSON.stringify(produs))
    window.localStorage.setItem('abonamentValue',JSON.stringify(abonament))
  },[user,produs,abonament])

  return (
    <Elements stripe={stripePromise}>
      <UserContext.Provider value={userValue}>
      <AbonamentContext.Provider value={abonamentValue}>
      <ProdusContext.Provider value={produsValue}>
        <BrowserRouter>
            <Header/>
            <Navigare/>
            <CautareRute/>
            <Routes>
              <Route path="/administrare" element={<PrivateRoute/>}>
                <Route path="/administrare" element = {<AdmPage/>}/>
              </Route>
              <Route path="/inregistrare-administrare" element={<PrivateRoute/>}>
                <Route path="/inregistrare-administrare" element = {<InregistrareAdministare/>}/>
              </Route>
              <Route path="/" element = {<Acasa/>}/>
              <Route path="/conduceretpl" element = {<ConducereTPL/>}/>
              <Route path="/contact" element = {<Contact/>}/>
              <Route path="/galerie" element = {<Galerie/>}/>
              <Route path="/parcauto" element = {<ParcAuto/>}/>
              <Route path="/rute" element = {<Rute/>}/>
              <Route path="/anunturi" element = {<Anunturi/>}/>
              <Route path="/anunturi/anunt" element = {<Anunt/>}/>
              <Route path="/login" element = {<Login/>}/>
              <Route path="/anunturi" element = {<Anunturi/>}/>
              <Route path="/anunturi/anunt" element = {<Anunt/>}/>
              <Route path="/login" element = {<Login/>}/>
              <Route path="/inregistrare" element = {<Inregistrare/>}/>
              <Route path="/informatii-utilizator" element = {<InformatiiUtilizator/>}/>
              <Route path="/tarife" element = {<Tarife/>}/>
              <Route path="/checkout" element = {<Checkout/>}/>
              <Route path="/success" element = {<Success/>}/>
              <Route path="/cancel" element = {<Cancel/>}/>
              <Route path="/rambursare" element = {<Rambursare/>}/>
              <Route path="/validare" element = {<Validare/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
      </ProdusContext.Provider>
      </AbonamentContext.Provider>
      </UserContext.Provider>
    </Elements>
  );
}

export default App;
