import { useState } from 'react';
import React from 'react';
import '../styles/NeuralNetworkBlock.css';
import '../styles/NewNeuralNetworkBlock.css';

const NeuralNetworkBlock = ({ name, parameters, onDuplicate, onEdit, onDelete, editing, editingParams, onSaveEdit, onCancelEdit, onUpdateParams }) => {
  const [errorMessages, setErrorMessages] = useState([]);

  const handleSaveEdit = () => {
    const newErrorMessages = editingParams.map(param => {
      if(`${param.value}`.trim() === '')
        return `Нет значения у параметра - ${param.name}`;
      else
        return '';
    });

    // Устанавливаем сообщения об ошибках
    setErrorMessages(newErrorMessages);

    // Проверяем, есть ли пустые поля
    const isEmptyField = newErrorMessages.some(message => message !== '');
    if (isEmptyField) {
      return;
    }

    // Если все поля заполнены, сохраняем изменения
    onSaveEdit([...editingParams]);
  };

  return (
    <div className="neural-network-block">
      <div className="block-header">
        {name}
      </div>
      <div className="block-content">
        {editing ? (
          <ul>
            {errorMessages.map((message, index) => (
              message && <div key={index} className="error">{message}</div>
            ))}
            {editingParams.map((param, index) => (
              <li key={index}>
                {param.name} : 
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => {
                    setErrorMessages([]);
                    const updatedParameters = [...editingParams];
                    updatedParameters[index].value = e.target.value;
                    onUpdateParams(updatedParameters);
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {parameters.map((param, index) => (
              <li key={index}>
                {param.name}: {param.value}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="block-footer">
        {editing ? (
          <>
            <button onClick={() => handleSaveEdit()}>Сохранить</button>
            <button onClick={() => {
              setErrorMessages([]);
              onCancelEdit();
            }}>Отмена</button>
          </>
        ) : (
          <>
            <button onClick={onDuplicate}>Дублировать</button>
            <button onClick={onEdit}>Редактировать</button>
            <button onClick={onDelete}>Удалить</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NeuralNetworkBlock;
