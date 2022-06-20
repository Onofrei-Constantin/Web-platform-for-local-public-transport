import React from "react";
import '../css/popupqr.css'
import Close from '../assets/popup/close.svg';

function PopupQR(props)
{
    return(props.trigger)?(
        <div className="popup-qr">
            <div className="popup-qr-inner">
                <img src={Close} alt='' className="popup-qr-close" onClick={()=>props.setTrigger(false)}/>
                {props.children}
            </div>
        </div>
    ):"";
}

export default PopupQR;