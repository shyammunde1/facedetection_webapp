import React from 'react';
import Particles from 'react-particles';



const ParticleBackground = () => {
  const particleParams = {
    particles: {
      number: {
        value: 100, // Adjust the number of particles
      },
      size: {
        value: 3, // Adjust the size of particles
      },
    },
  };

  return (
    <div className="particle-background">
      <Particles params={particleParams} />
    </div>
  );
};

export default ParticleBackground;