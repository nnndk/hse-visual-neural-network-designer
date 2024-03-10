import React from 'react';
import '../styles/NeuralNetworkBlock.css';

const BaseBlock = ({ name, parameters }) => {
  return (
    <div className="neural-network-block">
      <div className="block-header">{name}</div>
      <div className="block-content">
        <ul>
              {parameters.map((param, index) => (
                <li key={index}>
                  {param.name}: {param.value}
                </li>
              ))}
          </ul>
      </div>
    </div>
  );
};

export default BaseBlock;