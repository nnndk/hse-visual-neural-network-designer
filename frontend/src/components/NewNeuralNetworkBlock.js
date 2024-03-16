import React, { useState } from 'react';
import '../styles/NewNeuralNetworkBlock.css'; // Импортируем стили

const NewNeuralNetworkBlock = ({ onCreateBlock }) => {
  const [blockName, setBlockName] = useState('');
  const [params, setParams] = useState([{ name: '', value: '' }]);
  const [nameError, setNameError] = useState('');

  const handleAddParam = () => {
    setParams([...params, { name: '', value: '' }]);
    setNameError('');
  };

  const handleRemoveParam = () => {
    setNameError('');
    if (params.length > 1) {
      setParams(params.slice(0, -1));
    }
  };

  const handleParamNameChange = (index, value) => {
    const newParams = [...params];
    newParams[index].name = value;
    setParams(newParams);
  };

  const handleParamValueChange = (index, value) => {
    const newParams = [...params];
    newParams[index].value = value;
    setParams(newParams);
  };

  const handleCreateBlock = () => {
    if (!blockName.trim()) {
      setNameError('Название блока - обязательное поле!');
      return;
    }

    onCreateBlock({
      name: blockName.trim(),
      parameters: params,
    });
    // Resetting form fields after creating block
    setBlockName('');
    setParams([{ name: '', value: '' }]);
    setNameError('');
  };

  return (
    <div className="new-neural-network-block">
        <input type="text" value={blockName} onChange={(e) => setBlockName(e.target.value)} placeholder='Название блока' />
        {nameError && <span className="error">{nameError}</span>}
      <div className="param-row">
        {params.map((param, index) => (
          <div key={index}>
              <input
                type="text"
                value={param.name}
                onChange={(e) => handleParamNameChange(index, e.target.value)}
                placeholder='Название параметра'
              />
              <input
                type="text"
                value={param.value}
                onChange={(e) => handleParamValueChange(index, e.target.value)}
                placeholder='Значение параметра'
              />
          </div>
        ))}
      </div>
      <div className="button-row">
        <button onClick={handleAddParam}>Добавить параметр</button>
        <button onClick={handleRemoveParam}>Удалить параметр</button>
      </div>
      <button onClick={handleCreateBlock} className="add-block-button">Добавить блок</button>
    </div>
  );
};

export default NewNeuralNetworkBlock;
