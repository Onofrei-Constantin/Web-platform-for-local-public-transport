import {useNavigate } from 'react-router-dom';
import React, {useEffect,useState} from "react";
import ContainerPagina from "../componente/containerPagina";
import { axiosJWT } from '../componente/axiosJWT';

const AnunuriAdmin = ()  => {
  let navigate = useNavigate();
  const[news, getNews] = useState(null);

  useEffect(() => {
    if(!localStorage.getItem("authToken")||!localStorage.getItem("authRefreshToken"))
    {
      navigate('/')
    }
  }, [navigate]);

   useEffect(()=>{
        getToateNoutatile();
    },[]);

    const getToateNoutatile = ()=>{
        const config = {
          headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

         axiosJWT.get('http://localhost:3001/private/anunturiAdmin',config)
            .then(response=>{
                if(response.data.length>0)
                {
                    getNews(response.data);
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
        const anunt = props;
        navigate('/anunuri-admin/anunt-admin', { state:{anunt: anunt}});
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

            await axiosJWT.post('http://localhost:3001/private/anunturiActiveaza',{id:id},config);
            
            news[index].activ=true;
            getNews([...news]);
        
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

            await axiosJWT.post('http://localhost:3001/private/anunturiDezactiveaza',{id:id},config);
            
            news[index].activ=false;
            getNews([...news]);
        } catch (error) {
            console.log(error);
        }

        
    }

    function afisareNews(info){
        return info.map((el,index)=>{
            return(
                <div className="" key={index}>
                    <h1>{el._id}</h1>
                    <h2 className="">{el.titlu}</h2>
                    <h3 className="">{el.tip}</h3>
                    <p className="">{el.text}</p>
                    <img src={el.imagine} alt='' style={{width:"500px"}}/>
                    {el.activ===false&& <button onClick={()=>{handleActivare(el._id,index)}}>Activeaza anunt</button>}
                    {el.activ===true && <button onClick={()=>{handleDezactivare(el._id,index)}}>Dezactiveaza anunt</button>}
                    <button className="" onClick={()=>ArataAnunt(el)}>Modifica anunt</button>
                    <hr className=""/>
                </div>
            );
        })
    }

    return  (
      <ContainerPagina>
          <div >
            <h1>AnunuriAdmin</h1>
            <div>
                {afisareNews(news)}
            </div>
          </div>
      </ContainerPagina>
    );
}

export default AnunuriAdmin;
