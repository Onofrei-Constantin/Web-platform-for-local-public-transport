import React from "react";
import '../css/footer.css'
import Email from '../assets/footer/email.svg';
import Telefon from '../assets/footer/telefon.svg';
import {Link} from 'react-router-dom';

const Footer = ()  => {
  return (
    <>
    <hr className="footer-hr"/>
    <div className="footer-container">
        <div className="footer-coloana">
            <h1 className="footer-h">Transport Public Local Suceava</h1>
            <p className="footer-p">Pagina oficială a societății de transport public - TPL SA Suceava - dezvoltată pentru TPL Suceava Str. Traian Vuia nr. 5 A, Suceava, ROMÂNIA</p>
        </div>

        <div className="footer-coloana">
            <h1 className="footer-h">Paginile cele mai accesate</h1>
            <ul className="footer-links">
                    <Link className="footer-link-css" to='/contact' >
                        <li>Contact TPL Suceava</li>
                    </Link>
                    <Link className="footer-link-css" to='/rute' >
                        <li>Rute</li>
                    </Link>
            </ul>
        </div>

        <div className="footer-coloana">
            <h1 className="footer-h">Contactează-ne</h1>
             <div className="footer-content">
                <img src={Telefon} alt="" className="footer-img"/>
                <p className="footer-p">Tel/Fax(secretariat): 0330 401 442</p>
            </div>
            <div className="footer-content">
                <img src={Email} alt="" className="footer-img"/>
                <a href="mailto:contact@tpl-sv.ro" className="footer-email">
                 contact@tpl-sv.ro
                </a>
            </div>
        </div>
    </div>
    </>
  );
}

export default Footer;
