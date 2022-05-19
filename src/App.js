import React from "react";
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
import LoginAdministrare from './administrare/loginAdministrare';
import InregistrareAdministare from "./administrare/inregistrareAdministrare";
import PrivateRoute from "./administrare/privateRoute";
import AdmPage from "./administrare/admPage";
import CautareRute from "./componente/cautareRute";
import Anunturi from "./pagini/anunturi";
import Anunt from "./componente/anunt";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './componente/i18n';


function App() {

  return (
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
          <Route path="/tarife" element = {<Tarife/>}/>
          <Route path="/anunturi" element = {<Anunturi/>}/>
          <Route path="/anunturi/anunt" element = {<Anunt/>}/>
          <Route path="/login-administrare" element = {<LoginAdministrare/>}/>
        </Routes>
        <Footer/>
    </BrowserRouter>
  );
}

export default App;
