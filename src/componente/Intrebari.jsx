import React from "react";

function Intrebari ({faq,index,toggleFAQ})
{
    return(
        <div className={"home-intrebare " + (faq.deschis ? "deschis" : '')} key={index} onClick={()=>toggleFAQ(index)}>
            <div className="home-intrebare-question">{faq.intrebare}</div>
            <div className="home-raspuns">{faq.raspuns}</div>
        </div>
        
    );
}

export default Intrebari;