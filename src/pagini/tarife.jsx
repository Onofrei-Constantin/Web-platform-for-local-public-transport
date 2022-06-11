import React,{useEffect,useState,useContext} from "react";
import ContainerPagina from "../componente/containerPagina";
import axios from "axios";
import {ProdusContext } from "../componente/ProdusContext";
import Bilet from '../assets/acasa/bilet.png';
import Abonament from '../assets/acasa/abonament.png';
import {useNavigate } from "react-router-dom";




const Tarife = ()  => {
  let navigate = useNavigate();

  const {setProdus} = useContext(ProdusContext);


  useEffect(()=>{
    getToateBiletele();
  },[]);

  const[bilete,getBilete] = useState(null);

  const getToateBiletele = ()=>{
         axios.get('http://localhost:3001/public/bilete/')
            .then( response=>{
                if(response.data.length>0)
                {
                  getBilete(response.data);
                }
            })
            .catch(err => console.error('Error: '+ err));
  }


  if(bilete==null)
  {
    return (
      <ContainerPagina>
        <div >
          <h1>Se incarca datele...</h1>
        </div>
      </ContainerPagina>
    );
  }

  const handleCumpara  = (props)=>{
    const produs = props;
    setProdus(produs);
    navigate('/checkout');
  }

  function afisareBilete(info){
        return info.map((el,index)=>{
            return(
                <div key={index}>
                    <img className="" src={el.tipImagine==='bilet' ? Bilet : Abonament} alt=""/>
                    <div>{el.numeBilet}</div>
                    <div>{el.pret===0 ? "Gratuit" : el.pret}</div>
                    <div>{el.valabilitate}</div>
                    <button onClick={()=>handleCumpara(el)}>Cumpara</button>
                </div>
            );
        })
    }

    
  

  return (
      <ContainerPagina>
                <div >
                    {afisareBilete(bilete)}
                </div>
        </ContainerPagina>
  );
}

export default Tarife;
