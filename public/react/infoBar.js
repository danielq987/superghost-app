import React from 'react';
import '../css/infoBar.css';

// import closeIcon from '../../icons/closeIcon.png';
// import onlineIcon from '../../icons/onlineIcon.png';

const InfoBar = ({ room }) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            {/* <img className="onlineIcon" src={onlineIcon} alt="online"/> */}
            <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
            {/* <a href="/"><img src={closeIcon} alt="close button"/></a> */}
        </div>
    </div>
);

export default InfoBar;