import React from 'react';
import '../styles/NeuralNetworkBlock.css';

const BaseBlock = ({ name, link, parameters }) => {
  return (
    <div className="neural-network-block">
      <div className="block-header"><a href={link} target="_blank">{name}</a></div>
      <div className="block-content">
        <ul>
              {parameters.map((param, index) => (
                <li key={index}>
                  {param.name}: {`${param.value}`}
                </li>
              ))}
          </ul>
      </div>
    </div>
  );
};

export default BaseBlock;