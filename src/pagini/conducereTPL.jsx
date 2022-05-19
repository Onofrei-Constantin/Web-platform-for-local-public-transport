import React from "react";
import ContainerPagina from "../componente/containerPagina";
import { useTranslation } from 'react-i18next';

const ConducereTPL = ()  => {
  const { t } = useTranslation();

  return (
    <ContainerPagina>
      <div >
        <h1>{t('Conducere TPL')}</h1>
      </div>
    </ContainerPagina>
  );
}

export default ConducereTPL;
