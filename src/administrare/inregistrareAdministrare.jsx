import ContainerPagina from "../componente/containerPagina";
import React, { useState, useEffect } from "react";
import {useNavigate } from 'react-router-dom';
import { axiosJWT } from '../componente/axiosJWT';


const InregistrareAdministare = ()  => {
    let navigate = useNavigate();
    const[email,setEmail]= useState("");
    const[cnp,setCnp] = useState("");
    const[parola,setParola]= useState("");
    const[confirmaparola,setConfirmaparola]= useState("");
    const[nume,setNume]= useState("");
    const[prenume,setPrenume]= useState("");
    const[telefon,setTelefon]= useState("");
    const[adresa,setAdresa]= useState("");
    const[error,setError]=useState("");


    useEffect(() => {
    if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
        {
            navigate('/')
        }
    }, [navigate,error]);


    const registerHandler= async (e)=>{
        e.preventDefault();

        const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

        if(parola!==confirmaparola)
        {
            setParola("");
            setConfirmaparola("");
            setTimeout(()=>{
                setError("");
            },5000);
            return setError("Passwords do not match")
        }

        try {
            await axiosJWT.post("http://localhost:3001/auth/registerAdmin",{email,cnp,parola,nume,prenume,telefon,adresa},config);
            navigate('/administrare');
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(()=>{
                setError("");
            },5000);
        }

    }

  return (
    <ContainerPagina>
        <div>
            <div>
                <form onSubmit={registerHandler}>
                    <h3>Inregistare Administare</h3>
                    {error&&<span>{error}</span>}
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" required id="email" placeholder="Introdu email" value=
                        {email} onChange={(e)=>setEmail(e.target.value)}></input>
                    </div>

                     <div>
                        <label htmlFor="cnp">CNP:</label>
                        <input type="number" required id="cnp" placeholder="Introdu cnp" value=
                        {cnp} onChange={(e)=>setCnp(e.target.value)}></input>
                    </div>

                    <div>
                        <label htmlFor="parola">Parola:</label>
                        <input type="password" required id="parola" placeholder="Introdu parola" value=
                        {parola} onChange={(e)=>setParola(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="confirmaparola">Confirma Parola:</label>
                        <input type="password" required id="confirmaparola" placeholder="Confirma parola" value=
                        {confirmaparola} onChange={(e)=>setConfirmaparola(e.target.value)}></input>
                    </div>

                    <div>
                        <label htmlFor="nume">Nume:</label>
                        <input type="text" required id="nume" placeholder="Introdu nume" value=
                        {nume} onChange={(e)=>setNume(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="prenume">Prenume:</label>
                        <input type="text" required id="prenume" placeholder="Introdu prenume" value=
                        {prenume} onChange={(e)=>setPrenume(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="telefon">Telefon:</label>
                        <input type="tel" required id="telefon" placeholder="Introdu telefon" value=
                        {telefon} onChange={(e)=>setTelefon(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="adresa">Adresa:</label>
                        <input type="text" required id="adresa" placeholder="Introdu adresa" value=
                        {adresa} onChange={(e)=>setAdresa(e.target.value)}></input>
                    </div>
                    <button type="submit" className="">Inregistreaza</button>
                </form>
            </div>
        </div>
    </ContainerPagina>
  );
}

export default InregistrareAdministare;
