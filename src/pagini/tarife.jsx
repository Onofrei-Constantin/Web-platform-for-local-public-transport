import React,{useEffect,useState} from "react";
import ContainerPagina from "../componente/containerPagina";
import axios from "axios";


const Tarife = ()  => {


  useEffect(()=>{
    getToateBiletele();
  },[]);

  const[bilete,getBilete] = useState(null);
  // const[newImagineAnunt,setNewImagineAnunt] = useState(null);

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

  function afisareBilete(info){
        return info.map((el,index)=>{
            return(
                <div key={index}>
                    <div>{el.tip}</div>
                    <div>{el.numeBilet}</div>
                    <div>{el.pret}</div>
                    <div>{el.valabilitate}</div>
                </div>
            );
        })
    }

    
  // const fileSelectedHnadler =(event)=>
  // {
  //   if(event.target.files && event.target.files.length>0)
  //   {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     reader.addEventListener("load", ()=>{
  //       setNewImagineAnunt(reader.result);
  //     })
  //   }
  // }
  

  // const fileUploadHandler = () =>{
  //   console.log(newImagineAnunt)
  //   const body = {
  //     titlu: "Anunt test",
  //     tip: "Anunt",
  //     text: "Text anunt test",
  //     imagine: newImagineAnunt,
  //   }

  //   axios.post("http://localhost:3001/anunturi/add",body).catch(function (error) {
  //   if (error.response) {
  //     // Request made and server responded
  //     console.log(error.response.data);
  //     console.log(error.response.status);
  //     console.log(error.response.headers);
  //   } else if (error.request) {
  //     // The request was made but no response was received
  //     console.log(error.request);
  //   } else {
  //     // Something happened in setting up the request that triggered an Error
  //     console.log('Error', error.message);
  //   }
  // });
  // }

  return (
      <ContainerPagina>
                <div >
                    {afisareBilete(bilete)}
                </div>
                {/* <div>
                  <input type="file" onChange={fileSelectedHnadler}/>
                  <button onClick={fileUploadHandler}>adauga</button>
                  <img src={newImagineAnunt} alt="" style={{width:"500px"}}/>
                </div> */}
        </ContainerPagina>
  );
}

export default Tarife;
