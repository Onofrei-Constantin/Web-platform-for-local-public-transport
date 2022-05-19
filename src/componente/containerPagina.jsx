import React, {useEffect} from "react";
import '../css/containerPagina.css';

const ContainerPagina = ({ children })  => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
    <hr className="container-pagina-hr"></hr>
        <div className="container-pagina-css"> 
            { children }
        </div>
    </>
  );
}

export default ContainerPagina;
