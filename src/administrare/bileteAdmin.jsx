import {useNavigate } from 'react-router-dom';
import React, {useEffect,useState} from "react";
import ContainerPagina from "../componente/containerPagina";
import { axiosJWT } from '../componente/axiosJWT';


const BileteAdmin = ()  => {
    let navigate = useNavigate();
    const[bilete, getBilete] = useState(null);

    useEffect(() => {
        if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
        {
        navigate('/')
        }
    }, [navigate]);

    useEffect(()=>{
            getToateBiletele();
        },[]);

    const getToateBiletele = ()=>{
        const config = {
          headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

         axiosJWT.get('http://localhost:3001/private/bileteAdmin',config)
            .then(response=>{
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
                <h1>Se incarca bilete...</h1>
            </div>
        </ContainerPagina>
        );
    }

    function ArataBilet(props){
        const bilet = props;
        navigate('/bilete-admin/modifica-bilet', { state:{bilet: bilet}});
    }


    const handleActivare = async (props,index)=>{
        const id = props;

        try {
            const config = {
                headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            };

            await axiosJWT.post('http://localhost:3001/private/bileteActiveaza',{id:id},config);
            
            await axiosJWT.post('http://localhost:3001/private/vanzariInVanzareActivare',{idBilet:id},config);

            bilete[index].inVanzare=true;
            getBilete([...bilete]);
        
        } catch (error) {
            console.log(error);
        }
    }

    const handleDezactivare = async (props,index)=>{
        const id = props;

        try {
            const config = {
                headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            };

            await axiosJWT.post('http://localhost:3001/private/bileteDezactiveaza',{id:id},config);
            
            await axiosJWT.post('http://localhost:3001/private/vanzariInVanzareDezactivare',{idBilet:id},config);

            bilete[index].inVanzare=false;
            getBilete([...bilete]);
        } catch (error) {
            console.log(error);
        }

        
    }

    function afisareBilete(info){
        return info.map((el,index)=>{
            return(
                <div className="" key={index}>
                    <h1>{el._id}</h1>
                    <p className="">{el.numeBilet}</p>
                    <p className="">{el.pret}</p>
                    <p className="">{el.valabilitateInfo}</p>
                    <p className="">{el.valabilitateTip}</p>
                    <p className="">{el.nominal}</p>
                    <p className="">{el.perioada}</p>
                    <p className="">{el.activ}</p>
                    <p className="">{el.tipPersoana}</p>
                    <p className="">{el.tip}</p>
                    {el.inVanzare===false&& <button onClick={()=>{handleActivare(el._id,index)}}>Activeaza bilet</button>}
                    {el.inVanzare===true && <button onClick={()=>{handleDezactivare(el._id,index)}}>Dezactiveaza bilet</button>}
                    <button className="" onClick={()=>ArataBilet(el)}>Modifica bilet</button>
                    <hr className=""/>
                </div>
            );
        })
    }

    return  (
      <ContainerPagina>
          <div >
            <h1>BileteAdmin</h1>
            {afisareBilete(bilete)}
          </div>
      </ContainerPagina>
    );
}

export default BileteAdmin;
