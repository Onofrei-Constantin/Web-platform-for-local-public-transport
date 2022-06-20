import React, { useEffect, useState ,useRef} from "react";
import ContainerPagina from "../componente/containerPagina";
import {useLocation } from 'react-router-dom';
import '../css/rute.css';
import PopupInfromatii from "../componente/popupinformatii";
import axios from "axios";
import Atentionare from '../assets/rute/atentionare.svg';
import Autobuz from '../assets/rute/autobuz.png';
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer ,
  Marker,
} from '@react-google-maps/api';





const Rute = () =>  {
    
    const[plecare,getPlecare] = useState(null);
    const[intermediare,getIntermediare] = useState([]);
    const[destinatie,getDestinatie] = useState(null);
    const[statiiData, getStatiiData] = useState([]); 
    const[statii,getStatii] = useState(null);
    const[marcuri,setMarcuri] = useState([]);
    const[plecareS,setPlecareS] = useState('');
    const[destinatieS,setDesitnatieS] = useState('');
    const[centru,setCentru] = useState(null);
    const[dataRute,getDataRute] = useState(null);
    const[informatiiRuta,setInformatiiRuta] = useState(null);
    const refCautareRute = useRef(null);
    const[esteCautare,setEsteCautare] = useState(false);
    const[esteRuta,setEsteRuta] = useState(false);
    const[buttonPopUp,setButtonPopUp] = useState(false);
    const[numarRuta,setNumarRuta] = useState(null);
    const {state} = useLocation();


    useEffect(()=>{
        getToateRutele();
        getToateStatii();
        setCentru({lat:47.659606368157, lng:26.280503142761646})
    },[]);

    useEffect(()=>{
        if(state!=null)
        {
            const { plecareC, destinatieC } = state;
            setPlecareS(plecareC);
            setDesitnatieS(destinatieC);
            setEsteCautare(true);
        }
    },[state]);

    


    useEffect(()=>{
        function assignRuta(){
            getPlecare(null)
            getDestinatie(null)
            getIntermediare([])
            statiiData.forEach((el,index)=>{
                if(index===0)
                {
                    getPlecare({
                        lat:el.lat,
                        lng:el.lng,
                        label:el.label,
                        marc: el.marc
                    })
                }
                else if(index===statiiData.length-1)
                {
                    getDestinatie({
                        lat:el.lat,
                        lng:el.lng,
                        label:el.label,
                        marc: el.marc
                    })
                }
                else
                {
                    getIntermediare(intermediare=>[...intermediare,{
                        lat:el.lat,
                        lng:el.lng,
                        label:el.label,
                        marc: el.marc
                    }]);
                }
            })
        };
        
        if(statiiData!=null)
        {
            assignRuta();
        }
    },[statiiData])

    useEffect(()=>{
        async function showRoute () 
        {
           
                const origin1 = {lat:plecare.lat,lng:plecare.lng}

                const waypoints1  = intermediare.slice(0,25).map(p=>({
                    location: {lat:p.lat,lng:p.lng}, stopover: true
                }))
                const dest1 = {lat:intermediare[25].lat,lng:intermediare[25].lng}

                const directionService1 = new window.google.maps.DirectionsService()
                const results1 = await directionService1.route({
                    origin: origin1, 
                    waypoints:waypoints1,
                    destination: dest1,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                })
                setDirectie(results1);
                
                const origin2 = {lat:intermediare[25].lat,lng:intermediare[25].lng}

                const waypoints2  = intermediare.slice(26,intermediare.length).map(p=>({
                    location: {lat:p.lat,lng:p.lng}, stopover: true
                }))
                const dest2 = {lat:destinatie.lat,lng:destinatie.lng}

                const directionService2 = new window.google.maps.DirectionsService()
                const results2 = await directionService2.route({
                    origin: origin2, 
                    waypoints:waypoints2,
                    destination: dest2,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                })
                setDirectiePlus(results2);
            
        }
        if(plecare!=null&&intermediare!=null&&destinatie!=null)
        {
            showRoute();
        }
    },[plecare,intermediare,destinatie])

    useEffect(()=>{
        function marcuriRute ()  {
        setMarcuri([]);

        setMarcuri(marcuri=>[...marcuri,{
            position:{lat:plecare.lat,lng:plecare.lng},
            label:plecare.label
            }])

        const locatii = intermediare.map(p=>({
            position:{lat:p.lat,lng:p.lng},
            label:p.label,
            marc:p.marc
        }))
        locatii.forEach((p)=>{p.marc!=='false' &&
            setMarcuri(marcuri=>[...marcuri, p]);
        });

        setMarcuri(marcuri=>[...marcuri,{
            position:{lat:destinatie.lat,lng:destinatie.lng},
            label:destinatie.label
            }])

        setEsteRuta(true);
        }
        if(plecare!=null&&intermediare!=null&&destinatie!=null)
        {
            marcuriRute();
        }
    },[plecare,intermediare,destinatie])

    const getToateRutele = ()=>{
         axios.get('http://localhost:3001/public/rute/')
            .then( response=>{
                if(response.data.length>0)
                {
                    getStatii(response.data.map(el => el.numeStatii)); 
                    setInformatiiRuta(response.data.map(el => ({
                        linie:el.linie,
                        denumire:el.denumire,
                        observatii:el.observatii,
                        luni_vineri:el.luni_vineri,
                        sambata_duminica:el.sambata_duminica
                    })));
                }
            })
            .catch(err => console.error('Error: '+ err));
    }

    const getToateStatii = ()=>{
         axios.get('http://localhost:3001/public/statii/')
            .then( response=>{
                if(response.data.length>0)
                {
                    getDataRute(response.data.map(el=>el.dataRute));
                }
            })
            .catch(err => console.error('Error: '+ err));
    }


    const [directie, setDirectie] = useState(null);
    const [directiePlus, setDirectiePlus] = useState(null);

    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });


    if(!isLoaded)
    {
        return <ContainerPagina>
            <h1>Se incarca harta...</h1>
        </ContainerPagina>
    }

    if(informatiiRuta==null || statii==null)
    {
        return (
        <ContainerPagina>
            <div >
                <h1>Se incarca datele...</h1>
            </div>
        </ContainerPagina>
        );
    }

    function statiiRute(props)
    {
        getStatiiData([]);

        const numarRuta = props;
        statii[numarRuta].forEach((elS) => {
            dataRute.forEach(elD=>{
                if(elS===elD.label)
                {
                    getStatiiData(statiiData=>[...statiiData,{
                        lat:elD.lat,
                        lng:elD.lng,
                        label:elD.label,
                        marc: elD.marc
                        }]);
                    }
                })
        })
    }

    function incarcaInformatiiObservatii(props)
    {
        return informatiiRuta[props].observatii.map((el,index)=>{
            return(
                <div key={index}>
                   <h3 className="rute-informatii-h3-observatii" >{el}</h3>
                </div>
            );
        });
    }

    function incarcaInformatiiLuniVineriPrimele(props)
    {
        return informatiiRuta[props].luni_vineri.primele_curse.map((el,index)=>{
            return(
                <div key={index}>
                    <p className="rute-informatii-p">{el}</p>
                </div>
            );
        });
    }

    function incarcaInformatiiLuniVineriUltimele(props)
    {
        return informatiiRuta[props].luni_vineri.ultimele_curse.map((el,index)=>{
            return(
                <div key={index}>
                  <p className="rute-informatii-p">{el}</p>
                </div>
            );
        });
    }

    function incarcaInformatiiSambataPrimele(props)
    {
        return informatiiRuta[props].sambata_duminica.primele_curse_sambata.map((el,index)=>{
            return(
                <div key={index}>
                  <p className="rute-informatii-p">{el}</p>
                </div>
            );
        });
    }
    function incarcaInformatiiDuminicaPrimele(props)
    {
        return informatiiRuta[props].sambata_duminica.primele_curse_duminica.map((el,index)=>{
            return(
                <div key={index}>
                  <p className="rute-informatii-p">{el}</p>
                </div>
            );
        });
    }
    function incarcaInformatiiSambataUltimele(props)
    {
        return informatiiRuta[props].sambata_duminica.ultimele_curse_sambata.map((el,index)=>{
            return(
                <div key={index}>
                  <p className="rute-informatii-p">{el}</p>
                </div>
            );
        });
    }
    function incarcaInformatiiDuminicaUltimele(props)
    {
        return informatiiRuta[props].sambata_duminica.ultimele_curse_duminica.map((el,index)=>{
            return(
                <div key={index}>
                  <p className="rute-informatii-p">{el}</p>
                </div>
            );
        });
    }


    function searchRuta (info){  
        return info.map ((el,index)=>{
            const pInd = statii[index].indexOf(plecareS);
            const dInd = statii[index].lastIndexOf(destinatieS); 
            if(pInd > -1 && dInd > -1 && (pInd<dInd)){
                return(
                    <div className="rute-cautare-gasite-content" key={index}>
                        <img src={Autobuz} alt='' className="rute-cautare-autobuz"/>
                        <h2 className="rute-cautare-gasite-h2">{el.linie}</h2>
                        <h3 className="rute-cautare-gasite-h3">{el.denumire}</h3>
                        <button className="rute-cautare-ruta" onClick={()=>{statiiRute(index);setNumarRuta(index);executeScroll()}} >Vezi ruta</button>
                    </div>
                );
            }
            return null;
        })
    }


    function afisareRute(info){
        return info.map((el,index)=>{
            return(
                <div key={index}>
                    <li onClick={()=>{statiiRute(index);setNumarRuta(index);executeScroll()}} className="rute-container-linie">{el.linie}</li>
                </div>
            );
        })
    }

    if(esteCautare&&refCautareRute.current!=null)
    {
        refCautareRute.current.scrollIntoView(); 
        setEsteCautare(false);
    }

    const executeScroll = () => window.scrollTo(0, 350);
    

    return (
        <ContainerPagina>
        <div className="rute-container" >
            <GoogleMap center={centru} zoom={14} mapContainerStyle={{ height:"80vh", width: "100%"}}
            options={{zoomControl:false,streetViewControl:false,mapTypeControl:false,fullscreenControl:false}}
            >
               {directie && <DirectionsRenderer options={{suppressMarkers: true,preserveViewport:true}} directions={directie}/>} 
               {directiePlus && <DirectionsRenderer options={{suppressMarkers: true,preserveViewport:true}} directions={directiePlus}/>} 
               {marcuri.map((m,index) => 
                    <Marker key={index}
                        position={{ lat: m.position.lat, lng: m.position.lng }}
                        label={{text:m.label,color:"black",fontSize:"15px"}}
                    />
                    )}
            </GoogleMap>
            <div className="rute-container-lista">
                <h1 className="rute-container-h1">{numarRuta!=null ? informatiiRuta[numarRuta].linie : "Selectatai o ruta"}</h1>
                <hr className="rute-container-hr"/>
                <ul className="rute-container-linii">
                    {afisareRute(informatiiRuta)}   
                </ul>
            </div>
            <button className="rute-container-infromatii" disabled={!esteRuta} onClick={()=>setButtonPopUp(true)}>Informatii ruta</button>
        </div>
        <div className="rute-cautare-container"  ref={refCautareRute}>
            {(state!==null&&searchRuta(informatiiRuta).every(function(v){return v===null})) ? (
                <div className="rute-cautare-negasite">
                    <div className="rute-cautare-negasite-content">
                        <img className="rute-cautare-atentionare" src={Atentionare} alt='' />
                        <h1>Nu au fost gasite rute pentru cele 2 statii indicate!</h1>
                    </div>
                    <button className="rute-cautare-negasite-buton" onClick={executeScroll}>Vezi rutele</button>
                </div>
            ) : (state!==null&&
                <div className="rute-cautare-gasite-wrap">
                    <h1 className="rute-cautare-gasite-h1">Rute gasite:</h1>
                    <div className="rute-cautare-gasite">
                        {searchRuta(informatiiRuta)}
                    </div>
                </div>
            )}
        </div>
        <PopupInfromatii trigger={buttonPopUp} setTrigger={setButtonPopUp}>
            <div className="rute-informatii-observatii">
                <div className="rute-informatii-observatii-content">
                    <img src={Atentionare} alt='' className="rute-informatii-atentie"/>
                    <h1 className="rute-informatii-h1">Atentie:</h1>
                </div>
                {numarRuta!=null&&incarcaInformatiiObservatii(numarRuta)}
            </div>
            <div className="rute-informatii-luni-vineri">
                <div className="rute-informatii-luni-vineri-primele">
                    <h3 className="rute-informatii-h3">Primele curse Luni-Vineri</h3>
                    {numarRuta!=null&&incarcaInformatiiLuniVineriPrimele(numarRuta)}
                </div>
                <div className="rute-informatii-luni-vineri-ultimele">
                    <h3 className="rute-informatii-h3">Ultimele curse Luni-Vineri</h3>
                    {numarRuta!=null&&incarcaInformatiiLuniVineriUltimele(numarRuta)}
                </div>
            </div>

            <div className="rute-informatii-sambata">
                <div className="rute-informatii-sambata-primele-ultimele">
                    <h3 className="rute-informatii-h3">Primele curse Sambata</h3>
                    {numarRuta!=null&&incarcaInformatiiSambataPrimele(numarRuta)}
                </div>
                <div className="rute-informatii-sambata-primele-ultimele">
                    <h3 className="rute-informatii-h3">Ultimele curse Sambata</h3>
                    {numarRuta!=null&&incarcaInformatiiSambataUltimele(numarRuta)}
                </div>
            </div>

            <div className="rute-informatii-duminica">
                <div className="rute-informatii-duminica-primele-ultimele">
                    <h3 className="rute-informatii-h3">Primele curse Duminica</h3>
                    {numarRuta!=null&&incarcaInformatiiDuminicaPrimele(numarRuta)}
                </div>
                <div className="rute-informatii-duminica-primele-ultimele">
                    <h3 className="rute-informatii-h3">Ultimele curse Duminica</h3>
                    {numarRuta!=null&&incarcaInformatiiDuminicaUltimele(numarRuta)}
                </div>
            </div>

        </PopupInfromatii>
        </ContainerPagina>
    );
}

export default Rute;
