import React from 'react';
import '../styles/NeuralNetworkBlock.css';

const NeuralNetworkBlock = ({ name, parameters, onDuplicate, onEdit, onDelete, editing, editingParams, onSaveEdit, onCancelEdit, onUpdateParams }) => {
  return (
    <div className="neural-network-block">
      <div className="block-header">
        {name}
      </div>
      <div className="block-content">
        {editing ? (
          <ul>
            {editingParams.map((param, index) => (
              <li key={index}>
                <input
                  type="text"
                  value={param.name}
                  onChange={(e) => {
                    const updatedParameters = [...editingParams];
                    updatedParameters[index].name = e.target.value;
                    onUpdateParams(updatedParameters);
                  }}
                />
                :
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => {
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
            <button onClick={() => onSaveEdit([...editingParams])}>Сохранить</button>
            <button onClick={() => onCancelEdit()}>Отмена</button>
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
