import React,{useState,useEffect} from "react";
import ContainerPagina from "../componente/containerPagina";
import {useNavigate } from 'react-router-dom';
import Bilet from '../assets/acasa/bilet.png';
import Abonament from '../assets/acasa/abonament.png';
import axios from "axios";
import '../css/acasa.css'

const Home = ()  => {

  useEffect(()=>{
        getToateNoutatile();
        getToateBiletele();
    },[]);

    const[news, getNews] = useState(null);
    const[bilete,getBilete] = useState(null);
    const navigate = useNavigate();

    const getToateNoutatile = ()=>{
         axios.get('http://localhost:3001/anunturi/home')
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

    const getToateBiletele = ()=>{
         axios.get('http://localhost:3001/bilete/')
            .then( response=>{
                if(response.data.length>0)
                {
                  getBilete(response.data);
                }
            })
            .catch(err => console.error('Error: '+ err));
  }

    if(news==null||bilete==null)
    {
        return (
        <ContainerPagina>
            <div >
                <h1>Se incarca datele...</h1>
            </div>
        </ContainerPagina>
        );
    }

    function ArataAnunt(props){
        const id = props;
        navigate('/anunturi/anunt', { state:{id: id}});
    }

    function renderAnunturi (info){
      return info.map((el,index)=>{
            return(
                <div className="home-anunturi-sectiune" key={index}>
                    <h2 className="home-anunturi-h2">{el.titlu}</h2>
                    <h3 className="home-anunturi-h3">{el.tip}</h3>
                    <p className="home-anunturi-p">{el.text}</p>
                    <button className="home-anunuti-buton" onClick={()=>ArataAnunt(el.id)}>Citeste tot..</button>
                    <hr className="home-anunturi-separator"/>
                </div>
            );
        })
    }

    function renderBilete(info){
       return info.map((el,index)=>{
            return(
                <div className="home-bilete-sectiune" key={index}>
                    <img className="home-bilete-imagine" src={el.tip==='bilet' ? Bilet : Abonament} alt=""/>
                    <h2 className="home-bilete-h2">{el.numeBilet}</h2>
                    <p className="home-bilete-p">{el.pret + " Lei"}</p>
                    <p className="home-bilete-p">{el.valabilitate}</p>
                </div>
            );
        })
    }

  return (
    <ContainerPagina>
      <div className="home-page">
        <div className="home-anunt-wrap">
          <h1 className="home-anuntui-h1-main">Noutati TPL</h1>
          <div className="home-anunt-container">
            {renderAnunturi(news)}
            <button className="home-anunuti-buton" onClick={()=>navigate('/anunturi')}>Vezi toate anunturile</button>
          </div>
        </div>
        <div className="home-bilet-wrap">
          <h1 className="home-bilete-h1-main">Tarife</h1>
          <div className="home-bilete-container">
            {renderBilete(bilete)}
          </div>
          <button className="home-bilete-buton" onClick={()=>navigate('/tarife')}>Vezi mai multe informatii despre tarife</button>
        </div>
      </div>
    </ContainerPagina>
  );
}

export default Home;
