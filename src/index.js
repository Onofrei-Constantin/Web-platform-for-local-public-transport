import React,{Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ContainerPagina from "./componente/containerPagina";
import App from './App';

const loadLang = (
    <ContainerPagina>
        <div>
            <h1>Se incarca limba...</h1>
        </div>
    </ContainerPagina>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Suspense fallback={loadLang}>
        <App />
    </Suspense>
);



