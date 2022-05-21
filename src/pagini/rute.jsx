import React, { useEffect, useState } from "react";
import ContainerPagina from "../componente/containerPagina";
import {useLocation } from 'react-router-dom';
import '../css/rute.css';
import axios from "axios";
//import {dataRute} from '../data/dataRute'
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
    const[denumire,getDenumire] = useState(null);
    const[statii,getStatii] = useState(null);
    const[marcuri,setMarcuri] = useState([]);
    const[plecareS,setPlecareS] = useState('');
    const[destinatieS,setDesitnatieS] = useState('');
    const[centru,setCentru] = useState(null);
    const[dataRute,getDataRute] = useState(null);
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
            setDesitnatieS(destinatieC)
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
        const origin = {lat:plecare.lat,lng:plecare.lng}

        const waypoints  = intermediare.map(p=>({
            location: {lat:p.lat,lng:p.lng}, stopover: true
        }))

        const dest = {lat:destinatie.lat,lng:destinatie.lng}

        const directionService = new window.google.maps.DirectionsService()
        const results = await directionService.route({
            origin: origin, 
            waypoints:waypoints,
            destination: dest,
            travelMode: window.google.maps.TravelMode.DRIVING,
        })
        setDirectie(results);  
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
                    getDenumire(response.data.map(el => el.denumire));
                    getStatii(response.data.map(el => el.numeStatii)); 
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

    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });


    if(!isLoaded)
    {
        return <ContainerPagina>
            <h1>Se incarca harta...</h1>
        </ContainerPagina>
    }

    if(denumire==null || statii==null)
    {
        return (
        <ContainerPagina>
            <div >
                <h1>Se incarca datele...</h1>
            </div>
        </ContainerPagina>
        );
    }

    function searchRuta (info){  
        return info.map ((el,index)=>{
            const pInd = statii[index].indexOf(plecareS);
            const dInd = statii[index].lastIndexOf(destinatieS); 
            if(pInd > -1 && dInd > -1 && (pInd<dInd)){
                return(
                    <div key={index}>
                        <div>{el}</div>
                        <button onClick={()=>{statiiRute(index)}} className="rute-container-buton">{el}</button>
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
                    <button onClick={()=>{statiiRute(index)}} className="rute-container-buton">{el}</button>
                </div>
            );
        })
    }

    function statiiRute(props)
    {
        getStatiiData([])

        const numarRuta = props;
        statii[numarRuta].forEach((elS) => {
            dataRute.forEach(elD=>{
                if(elS===elD.label)
                {
                    getStatiiData(intermediare=>[...intermediare,{
                        lat:elD.lat,
                        lng:elD.lng,
                        label:elD.label,
                        marc: elD.marc
                        }]);
                    }
                })
        })
    }

    



    return (
        <ContainerPagina>
        <div className="rute-cautare-container">
            {(state!==null&&searchRuta(denumire).every(function(v){return v===null})) ? <h1>Nu sunt rute!</h1> : searchRuta(denumire)}
        </div>
        <div className="rute-container">
            <GoogleMap center={centru} zoom={14} mapContainerStyle={{ height:"80vh", width: "100%"}}
            options={{zoomControl:false,streetViewControl:false,mapTypeControl:false,fullscreenControl:false}}
            >
               {directie && <DirectionsRenderer options={{suppressMarkers: true}} directions={directie}/>} 
               {marcuri.map((m,index) => 
                    <Marker key={index}
                        position={{ lat: m.position.lat, lng: m.position.lng }}
                        label={m.label}
                    />
                    )}
            </GoogleMap>
        </div>
        {afisareRute(denumire)}
        </ContainerPagina>
    );

    
}

export default Rute;
