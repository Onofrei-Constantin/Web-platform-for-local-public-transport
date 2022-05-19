import React,{useState,useEffect} from "react";
import ContainerPagina from "../componente/containerPagina";
import {useNavigate } from 'react-router-dom';
import axios from 'axios'
import '../css/anunturi.css'

const Anunturi = ()  => {

    useEffect(()=>{
        getToateNoutatile();
    },[]);

    const[news, getNews] = useState(null);
    const navigate = useNavigate();

    const getToateNoutatile = ()=>{
         axios.get('http://localhost:3001/anunturi/')
            .then(response=>{
                if(response.data.length>0)
                {
                    getNews(response.data.map(el=>({
                        id:el._id,
                        titlu:el.titlu,
                        tip:el.tip,
                        text:el.text,
                    })));
                }
            })
            .catch(err => console.error('Error: '+ err));
    }

    if(news==null)
    {
        return (
        <ContainerPagina>
            <div >
                <h1>Se incarca anunuti...</h1>
            </div>
        </ContainerPagina>
        );
    }

    function ArataAnunt(props){
        const id = props;
        navigate('/anunturi/anunt', { state:{id: id}});
    }


    function afisareNews(info){
        return info.map((el,index)=>{
            return(
                <div className="anunturi-sectiune" key={index}>
                    <h2 className="anunturi-h2">{el.titlu}</h2>
                    <h3 className="anunturi-h3">{el.tip}</h3>
                    <p className="anunturi-p">{el.text}</p>
                    <button className="anunuti-buton" onClick={()=>ArataAnunt(el.id)}>Citeste tot..</button>
                    <hr className="anunturi-separator"/>
                </div>
            );
        })
    }


    return (
        <ContainerPagina>
        <div >
            <h1 className="anunturi-h1">Anunturi TPL</h1>
            <div className="anunturi-container">
                {afisareNews(news)}
            </div>
        </div>
        </ContainerPagina>
    );
}

export default Anunturi;
