import {useNavigate } from 'react-router-dom';
import React, {useEffect,useState} from "react";
import ContainerPagina from "../componente/containerPagina";
import { axiosJWT } from '../componente/axiosJWT';


const AdaugaBilet = ()  => {
  let navigate = useNavigate();
  const[tip,setTip] = useState(null);
  const[numeBilet,setNumeBilet] = useState(null);
  const[valabilitateInfo,setValabilitateInfo] = useState(null);
  const[valabilitateTip,setValabilitateTip] = useState(null);
  const[nominal,setNominal] = useState(null);
  const[perioada,setPerioada] = useState(null);
  const[activ,setActiv] = useState(null);
  const[tipPersoana,setTipPersoana] = useState(null);
  const[inVanzare,setInVanzare] = useState(null);
  const[pret,setPret] = useState(null);
  const[esteActiv1,setEsteActiv1] = useState(false);
  const[esteActiv2,setEsteActiv2] = useState(false);
  const[esteActiv3,setEsteActiv3] = useState(false);
  const[esteActiv4,setEsteActiv4] = useState(false);
  const[esteActiv5,setEsteActiv5] = useState(false);


  useEffect(() => {
    if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
    {
      navigate('/')
    }
  }, [navigate]);


    useEffect(()=>{
        if(tip==="bilet")
        {
            setValabilitateTip("zi");
            setPerioada(1);
            setNominal("nenominal");
            setActiv(true);
            setTipPersoana(null);
        }
    },[tip]);



    const handleModificare = async (e)=>{
        e.preventDefault();
        try {
            const config = {
                headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            };

            console.log(tip)
            console.log(numeBilet)
            console.log(valabilitateInfo)
            console.log(valabilitateTip)
            console.log(nominal)
            console.log(perioada)
            console.log(activ)
            console.log(tipPersoana)
            console.log(inVanzare)
            console.log(pret)

            await axiosJWT.post('http://localhost:3001/private/bileteAdauga',{tip:tip,numeBilet:numeBilet,pret:pret,valabilitateInfo:valabilitateInfo,valabilitateTip:valabilitateTip,nominal:nominal,perioada:perioada,activ:activ,tipPersoana:tipPersoana,inVanzare:inVanzare},config);

            navigate('/bilete-admin');
        } catch (error) {
            console.log(error)
        }
    }

    return  (
      <ContainerPagina>
          <div >
            <form onSubmit={handleModificare}>
                <h1>Bilet Admin</h1>
                <div>
                    <label htmlFor="activ">Tip:</label>
                    <div onClick={()=>{setEsteActiv5(!esteActiv5)}}>Alege una: {tip}</div>
                    {esteActiv5 && (<div>
                        <div onClick={()=>{setTip("bilet");setEsteActiv5(false)}}>Bilet</div>
                        <div onClick={()=>{setTip("abonament");setEsteActiv5(false)}}>Abonament</div>
                    </div>)}
                </div>
                <div>
                    <label htmlFor="numeBilet">Nume Bilet:</label>
                    <input
                        type="text"
                        required
                        id="numeBilet"
                        placeholder="Introdu Nume Bilet"
                        onChange={(e) => setNumeBilet(e.target.value)}
                        value={numeBilet||''}
                    />
                </div>
                <div>
                    <label htmlFor="valabilitateInfo">Informatii legate de valabilitate:</label>
                    <input
                        type="text"
                        required
                        id="valabilitateInfo"
                        placeholder="Introdu infromatii de valabilitate"
                        onChange={(e) => setValabilitateInfo(e.target.value)}
                        value={valabilitateInfo||''}
                    />
                </div>
                <div>
                    <label htmlFor="pret">Pret:</label>
                    <input
                        type="number"
                        required
                        id="texprett"
                        placeholder="Introdu pret"
                        onChange={(e) => setPret(e.target.value)}
                        value={pret||''}
                    />
                </div>
                {tip==="abonament"&&(<div>
                    <label htmlFor="activ">Nominal:</label>
                    <div onClick={()=>{setEsteActiv1(!esteActiv1)}}>Alege una: {nominal} {activ!=null&&activ.toString()}</div>
                    {esteActiv1 && (<div>
                        <div onClick={()=>{setActiv(true);setNominal("nominal");setEsteActiv1(false)}}>Nominal</div>
                        <div onClick={()=>{setActiv(false);setNominal("nenominal");setEsteActiv1(false)}}>Nenominal</div>
                    </div>)}
                </div>)}
                {(tip==="abonament"&&nominal==="nominal")&&(<div>
                    <label htmlFor="activ">Tipul persoanei:</label>
                    <div onClick={()=>{setEsteActiv2(!esteActiv2)}}>Alege una: {tipPersoana}</div>
                    {esteActiv2 && (<div>
                        <div onClick={()=>{setTipPersoana("normal");setEsteActiv2(false)}}>Normal</div>
                        <div onClick={()=>{setTipPersoana("elev");setEsteActiv2(false)}}>Elev</div>
                        <div onClick={()=>{setTipPersoana("student");setEsteActiv2(false)}}>Student</div>
                    </div>)}
                </div>)}
                {tip==="abonament" && (<div>
                    <label htmlFor="activ">Valabilitate tip:</label>
                    <div onClick={()=>{setEsteActiv4(!esteActiv4)}}>Alege una: {valabilitateTip}</div>
                    {esteActiv4 && (<div>
                        <div onClick={()=>{setValabilitateTip("luna");setEsteActiv4(false)}}>Luna</div>
                        <div onClick={()=>{setValabilitateTip("zi");setEsteActiv4(false)}}>Zi</div>
                        <div onClick={()=>{setValabilitateTip("zile");setEsteActiv4(false)}}>Zile</div>
                    </div>)}
                </div>)}
                {(tip==="abonament" && valabilitateTip==="zile") &&(<div>
                    <label htmlFor="perioada">Perioada:</label>
                    <input
                        type="number"
                        required
                        id="perioada"
                        placeholder="Introdu perioada"
                        onChange={(e) => setPerioada(e.target.value)}
                        value={perioada||''}
                    />
                </div>)}
                <div>
                    <label htmlFor="activ">Pus in vanzare:</label>
                    <div onClick={()=>{setEsteActiv3(!esteActiv3)}}>Alege una: {inVanzare!=null&&inVanzare.toString()}</div>
                    {esteActiv3 && (<div>
                        <div onClick={()=>{setInVanzare(true);setEsteActiv3(false)}}>Da</div>
                        <div onClick={()=>{setInVanzare(false);setEsteActiv3(false)}}>Nu</div>
                    </div>)}
                </div>
                <button type='submit'>Adauga</button>
            </form>
          </div>
      </ContainerPagina>
    );
}

export default AdaugaBilet;
