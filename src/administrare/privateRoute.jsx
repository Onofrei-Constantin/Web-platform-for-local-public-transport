import React,{useContext,useEffect,useState} from 'react';
import {  Outlet, Navigate  } from 'react-router-dom';
import { UserContext } from '../componente/UserContext';
import ContainerPagina from '../componente/containerPagina';

const PrivateRoute = ({pozitieNecesara}) => {
    const {user} = useContext(UserContext);
    const [seIncarca, setSeIncarca] = useState(true);

     useEffect(() => {
        if(user)
        {
            setSeIncarca(false);
        }
    }, [user]);

    if(seIncarca)
    {
        return (
        <ContainerPagina>
            <div >
                <h1>Se incarca datele...</h1>
            </div>
        </ContainerPagina>
        );
    }

    return (localStorage.getItem("authToken") && localStorage.getItem("authRefreshToken"))&&
    pozitieNecesara?.some(element => user?.pozitie === element)
    ? <Outlet />
    : user?.user
    ? <Navigate to="/neautorizat" />
    : <Navigate to="/login" />;
};

export default PrivateRoute;
