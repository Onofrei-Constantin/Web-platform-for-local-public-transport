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
import InregistrareAngajat from "./administrare/inregistrareAngajat";
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
import Scanare from "./administrare/scanare";
import Neautorizat from "./administrare/neautorizat";
import Validari from "./administrare/validari";
import ConfirmareValidare from "./administrare/confirmareValidare";
import ValidareFaraCerere from "./administrare/validareFaraCerere";
import AnunuriAdmin from "./administrare/anunuturiAdmin";
import AnuntAdmin from "./componente/anuntAdmin";
import AdaugaAnunt from "./administrare/adaugaAnunt";
import BileteAdmin from "./administrare/bileteAdmin";
import AdaugaBilet from "./administrare/adaugaBilet";
import ModificaBilet from "./componente/biletAdmin";


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  const [user,setUser] = useState({user:null,cnp:null,pozitie:null});
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
              <Route path="/administrare" element={<PrivateRoute pozitieNecesara={[1]}/>}>
                <Route path="/administrare" element = {<AdmPage/>}/>
              </Route>
              <Route path="/anunuri-admin" element={<PrivateRoute pozitieNecesara={[1]}/>}>
                <Route path="/anunuri-admin" element = {<AnunuriAdmin/>}/>
              </Route>
              <Route path="/anunuri-admin/anunt-admin" element={<PrivateRoute pozitieNecesara={[1]}/>}>
                <Route path="/anunuri-admin/anunt-admin" element = {<AnuntAdmin/>}/>
              </Route>
              <Route path="/anunt-adaugare" element={<PrivateRoute pozitieNecesara={[1]}/>}>
                <Route path="/anunt-adaugare" element = {<AdaugaAnunt/>}/>
              </Route>
              <Route path="/bilete-admin" element={<PrivateRoute pozitieNecesara={[1]}/>}>
                <Route path="/bilete-admin" element = {<BileteAdmin/>}/>
              </Route>
              <Route path="/bilete-admin/modifica-bilet" element={<PrivateRoute pozitieNecesara={[1]}/>}>
                <Route path="/bilete-admin/modifica-bilet" element = {<ModificaBilet/>}/>
              </Route>
              <Route path="/bilete-adaugare" element={<PrivateRoute pozitieNecesara={[1]}/>}>
                <Route path="/bilete-adaugare" element = {<AdaugaBilet/>}/>
              </Route>
              <Route path="/inregistrare-administrare" element={<PrivateRoute pozitieNecesara={[1]}/>}>
                <Route path="/inregistrare-administrare" element = {<InregistrareAdministare/>}/>
              </Route>
              <Route path="/inregistrare-angajat" element={<PrivateRoute pozitieNecesara={[1]}/>}>
                <Route path="/inregistrare-angajat" element = {<InregistrareAngajat/>}/>
              </Route>
              <Route path="/scanare" element={<PrivateRoute pozitieNecesara={[1,2]}/>}>
                <Route path="/scanare" element = {<Scanare/>}/>
              </Route>
              <Route path="/validari" element={<PrivateRoute pozitieNecesara={[1,2]}/>}>
                <Route path="/validari" element = {<Validari/>}/>
              </Route>
              <Route path="/confirmare-validare" element={<PrivateRoute pozitieNecesara={[1,2]}/>}>
                <Route path="/confirmare-validare" element = {<ConfirmareValidare/>}/>
              </Route>
              <Route path="/validare-fara-cerere" element={<PrivateRoute pozitieNecesara={[1,2]}/>}>
                <Route path="/validare-fara-cerere" element = {<ValidareFaraCerere/>}/>
              </Route>
              <Route path="/neautorizat" element = {<Neautorizat/>}/>
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
