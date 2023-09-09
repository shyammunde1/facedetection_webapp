import React from "react";
import "./logo.component.styles.scss";
import Tilt from 'react-parallax-tilt';


import brain from '../../assets/brain.png'



const Logo = () => {
  return (
    <div className="logocontainer">
      <Tilt className='tilt br2 shadow-2' style={{ height: 90, width: 95 }}>
        <div className="braincontainer">
            <img src={brain} alt="brain" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
