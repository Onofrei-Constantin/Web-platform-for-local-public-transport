import React from "react";
import { useEffect, useState,useRef } from "react";
import {useNavigate } from 'react-router-dom';
import Locatie from '../assets/cautareRute/locatie.svg'
import axios from 'axios';
import '../css/cautareRute.css'


const CautareRute = ()  => {


    useEffect(()=>{
    const closeSugestii = e =>{
      if(e.path[0]!==sugestiiRef1.current)
      {
        setSugestii1([]);
      }
      if(e.path[0]!==sugestiiRef2.current)
      {
        setSugestii2([]);
      }
    };

    document.body.addEventListener('click',closeSugestii);

    return () =>document.body.removeEventListener('click',closeSugestii);
    },[])

    const[plecare,setPlecare] = useState('');
    const[destinatie,setDestinatie] = useState('');
    const[sugestii1,setSugestii1] = useState([]);
    const[sugestii2,setSugestii2] = useState([]);
    const sugestiiRef1 = useRef();
    const sugestiiRef2 = useRef();
    const navigate = useNavigate();
    const[numeStatii,setNumeStatii] = useState(null);
    
    useEffect(()=>{
        getToateStatii();
    },[]);


    const getToateStatii = ()=>{
         axios.get('http://localhost:3001/public/statiiNume')
            .then( response=>{
                if(response.data.length>0)
                {
                    setNumeStatii(response.data.map(el=>el.dataRute.label));
                }
            })
            .catch(err => console.error('Error: '+ err));
    }

    const onSugest1 = (plecare)=>{
        setPlecare(plecare)
        setSugestii1([]);
    }

    const onSugest2 = (destinatie)=>{
        setDestinatie(destinatie)
        setSugestii2([]);
    }

    const onChangeHandler1 =(plecare)=>{
        let matches = [];
        if(plecare.length>0 )
        {
            matches = numeStatii.filter(statie =>{
                const regex = new RegExp(`${plecare}`,"gi")
                return statie.match(regex);
            })
        }
        setSugestii1(matches)
        setPlecare(plecare);
    }

    const onChangeHandler2 =(destinatie)=>{
        let matches = [];
        if(destinatie.length >0 )
        {
            matches = numeStatii.filter(statie =>{
                const regex = new RegExp(`${destinatie}`,"gi")
                return statie.match(regex);
            })
        }
        setSugestii2(matches)
        setDestinatie(destinatie);
    }


    function ArataCutare(){
        navigate('/rute', { state:{plecareC: plecare, destinatieC: destinatie}});
    }

    return (
        <div className="cautare-rute-component">
            <hr className="cautare-rute-hr"/>
            <div className="cautare-rute-container">
                <div className="cautare-rute-header-container">
                    <img src={Locatie} alt=''/>
                    <h1 className="cautare-rute-h1">Cautare Rute</h1>
                </div>
                <input className="cutare-rute-input" type="text" placeholder="Plecare" ref={sugestiiRef1} onChange={e=>onChangeHandler1(e.target.value)} value = {plecare} />
                {sugestii1.length>0 && <div className="cautare-rute-drop1">
                    {sugestii1.slice(0,3).map((el,index)=>
                        <div className="cautare-rute-drop-content" key={index} onClick={()=>onSugest1(el)}>{el}</div>
                    )}
                </div>}
                <input className="cutare-rute-input" type="text" placeholder="Sosire" ref={sugestiiRef2} onChange={e=>onChangeHandler2(e.target.value)} value={destinatie}/>
                {sugestii2.length>0 &&<div className="cautare-rute-drop2">
                    {sugestii2 && sugestii2.slice(0,3).map((el,index)=>
                        <div className="cautare-rute-drop-content" key={index} onClick={()=>onSugest2(el)}>{el}</div>
                    )}
                </div>}
                <button className="cutare-rute-buton" disabled={(plecare!=='' && destinatie!=='') ? false : true} onClick={()=>ArataCutare()}>Cauta</button>
            </div>
        </div>
    );
}

export default CautareRute;
