import React from "react";
import '../css/popupinformatii.css'
import Close from '../assets/popup/close.svg';



function PopupInfromatii(props)
{

    return(props.trigger)?(
        <div className="popup-informatii">
            <div className="popup-informatii-inner">
                <img src={Close} alt='' className="popup-informatii-close" onClick={()=>props.setTrigger(false)}/>
                {props.children}
            </div>
        </div>
    ):"";
}

export default PopupInfromatii;