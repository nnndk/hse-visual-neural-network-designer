import React, { Component } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag, copyObj, generateGuid } from '../utils';
import BaseBlock from '../components/BaseBlock';
import NeuralNetworkBlock from '../components/NeuralNetworkBlock';
import NewNeuralNetworkBlock from '../components/NewNeuralNetworkBlock';
import '../styles/MainPage.css';

class Copy extends Component {
  constructor() {
    super();

    this.state = {
      items1: [{id: generateGuid(), name: 'Some NW Block1', parameters: [{name: 'param1', value: 25}, {name: 'param2', value: 251}]}, {id: generateGuid(), name: 'Some NW Block2', parameters: [{name: 'param1', value: 25}]}],
      items2: [{id: generateGuid(), name: 'Some NW Block1', parameters: [{name: 'param1', value: 25}, {name: 'param2', value: 251}]}],
      editingId: null,
      editingParams: null,
      previousState: null,
      searchTerm: '',
    }
  }

  handleDuplicateNeuralBlock = (id) => {
    const itemIndex = this.state.items2.findIndex(item => item.id === id);
    const itemToDuplicate = this.state.items2[itemIndex];
    const duplicatedItem = copyObj(itemToDuplicate);
    duplicatedItem.id = generateGuid();
    const newItemList = [...this.state.items2];
    newItemList.splice(itemIndex + 1, 0, duplicatedItem);
    this.setState({ items2: newItemList });
  };

  handleDeleteNeuralBlock = (id) => {
    const newItemList = this.state.items2.filter(item => item.id !== id);
    this.setState({ items2: newItemList });
  };

  handleEditNeuralBlock = (block) => {
    this.setState({ 
      editingId: block.id,
      editingName: block.name,
      editingParams: [...block.parameters],
      previousState: copyObj(this.state.items2)
    });
    console.log(this.state);
  };
  
  handleSaveEdit = (updatedParameters) => {
    console.log(updatedParameters);
    if(updatedParameters == undefined){
      this.setState({ editingBlockId: null, editingBlock: null });
      return;
    }
    const editedBlockIndex = this.state.items2.findIndex(item => item.id === this.state.editingId);

    const updatedItems2 = [...this.state.items2];
    updatedItems2[editedBlockIndex].parameters = [...updatedParameters];

    this.setState({ items2: updatedItems2, editingId: null, editingParams: null});
  };
  
  handleCancelEdit = () => {
    this.setState({ editingId: null, editingParams: null, items2: this.state.previousState });
  };

  handleUpdateParams = (updatedParams) => {
    this.setState({ editingParams: updatedParams });
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleCreateBlock = (block) => {
    block.id = generateGuid();
    const newItems1 = [...this.state.items1, block];
    this.setState({ items1: newItems1 });
  };
  
  exportDataToJson = () => {
    const { items2 } = this.state;
    const jsonData = JSON.stringify(items2, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'items2.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  render() {
    const filteredItems1 = this.state.items1.filter(item =>
      item.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())
    );
    return (
      <div className="main-page">
      <div className="group">
        <div className="container first-container">
        <div className='header-label'>Блоки</div>
          <input 
            type="text"
            placeholder="Поиск по имени блока..."
            value={this.state.searchTerm}
            onChange={this.handleSearchChange}
            className='search-field'
          />
          <Container groupName="1" behaviour="copy" getChildPayload={i => this.state.items1[i]} onDrop={e => this.setState({ items1: applyDrag(this.state.items1, e) })}>
            {
              filteredItems1.map((p,i) => {
                return (
                  <Draggable key={i}>
                    <BaseBlock
                      name={p.name}
                      parameters={p.parameters}
                    />
                  </Draggable>
                );
              })
            }
          </Container>
          <NewNeuralNetworkBlock onCreateBlock={this.handleCreateBlock} className="new-block"/>
        </div>
        <div className="container second-container">
          <div className='header-label'>Нейросеть</div>
          <button className="export-button" onClick={this.exportDataToJson}>Экспорт</button>
          <Container groupName="1" getChildPayload={i => this.state.items2[i]} onDrop={e => this.setState({ items2: applyDrag(this.state.items2, e) })}>
            {
              this.state.items2.map((p, i) => {
                return (
                  <Draggable key={i}>
                    <NeuralNetworkBlock
                      name={p.name}
                      parameters={p.parameters}
                      onDuplicate={() => this.handleDuplicateNeuralBlock(p.id)}
                      onEdit={() => this.handleEditNeuralBlock(p)}
                      onDelete={() => this.handleDeleteNeuralBlock(p.id)}
                      // Добавляем новые пропсы для редактирования
                      editing={this.state.editingId == p.id}
                      editingParams={this.state.editingParams}
                      onSaveEdit={this.handleSaveEdit}
                      onCancelEdit={this.handleCancelEdit}
                      onUpdateParams={this.handleUpdateParams}
                    />
                  </Draggable>
                );
              })
            }
          </Container>
        </div>       
      </div>
      </div>
    );
  }
}

export default Copy;
