import React, { Component } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag, copyObj, generateGuid } from '../services/utils';
import BaseBlock from '../components/BaseBlock';
import NeuralNetworkBlock from '../components/NeuralNetworkBlock';
import {exportBlocks, validateModel } from '../services/backend_service';
import { toast, Bounce } from 'react-toastify';
import '../styles/MainPage.css';

const pytorchBlocks = require('../library_blocks/pytorch.json');
const tensorflowBlocks = require('../library_blocks/tensorflow.json');

class Copy extends Component {
  constructor() {
    super();

    this.state = {
      neuralNetwork: [],
      editingId: null,
      editingParams: null,
      previousState: null,
      searchTerm: '',
      currentBlocks: pytorchBlocks,
      library: "pytorch"
    }
  }

  handleDuplicateNeuralBlock = (id) => {
    const itemIndex = this.state.neuralNetwork.findIndex(item => item.id === id);
    const duplicatedItem = copyObj(this.state.neuralNetwork[itemIndex]);
    duplicatedItem.id = generateGuid();
    const newItemList = [...this.state.neuralNetwork];
    newItemList.splice(itemIndex + 1, 0, duplicatedItem);
    this.setState({ neuralNetwork: newItemList });
  };

  handleDeleteNeuralBlock = (id) => {
    const newItemList = this.state.neuralNetwork.filter(item => item.id !== id);
    this.setState({ neuralNetwork: newItemList });
  };

  handleEditNeuralBlock = (block) => {
    this.setState({ 
      editingId: block.id,
      editingName: block.name,
      editingParams: [...block.parameters],
      previousState: copyObj(this.state.neuralNetwork)
    });
  };
  
  handleSaveEdit = (updatedParameters) => {
    console.log(updatedParameters);
    if(updatedParameters == undefined){
      this.setState({ editingBlockId: null, editingBlock: null });
      return;
    }
    const editedBlockIndex = this.state.neuralNetwork.findIndex(item => item.id === this.state.editingId);

    const updatedItems2 = [...this.state.neuralNetwork];
    updatedItems2[editedBlockIndex].parameters = [...updatedParameters];

    this.setState({ neuralNetwork: updatedItems2, editingId: null, editingParams: null});
  };
  
  handleCancelEdit = () => {
    this.setState({ editingId: null, editingParams: null, neuralNetwork: this.state.previousState });
  };

  handleUpdateParams = (updatedParams) => {
    this.setState({ editingParams: updatedParams });
  };

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };
  
  handleExportData = () => {
    if(this.state.neuralNetwork == 0){
      this.showWarningMessage("Модель пуста!");
      return;
    }
    const blocks = this.state.neuralNetwork.map(i => ({ name: i.name, params: copyObj(i.parameters) }));
    const payload = { library: this.state.library, blocks: blocks }
    exportBlocks(payload, this.state.library);
  };

  handleValidateModel = () => {
    if(this.state.neuralNetwork == 0){
      this.showWarningMessage("Модель пуста!");
      return;
    }
    const blocks = this.state.neuralNetwork.map(i => ({ name: i.name, params: copyObj(i.parameters) }));
    const payload = { library: this.state.library, blocks: blocks }
    validateModel(payload);  
  }

  handleChangeLibraryType = (library) => {
    const blocks = library == "pytorch" ? pytorchBlocks : tensorflowBlocks;
    this.setState({ currentBlocks: blocks, neuralNetwork: [], library: library});
  }

  showWarningMessage = (text) => {
    toast.warn(text, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });
  }

  render() {
    const filteredBlocks = this.state.currentBlocks.filter(item =>
      item.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())
    );
    return (
      <div className="main-page">
      <div className="group">
        <div className="container first-container">
        <div className='header-label'>Блоки</div>
        <span>Библиотека : </span>
          <select className="block-types" onChange={(e) => this.handleChangeLibraryType(e.target.value)}>
            <option value="pytorch">pytorch</option>
            <option value="tensorflow">tensorflow</option>
          </select>     
          <input 
            type="text"
            placeholder="Поиск по имени блока..."
            value={this.state.searchTerm}
            onChange={this.handleSearchChange}
            className='search-field'
          />
          <Container groupName="1" behaviour="copy" getChildPayload={i => this.state.currentBlocks[i]} onDrop={e => this.setState({ currentBlocks: applyDrag(this.state.currentBlocks, e) })}>
            {
              filteredBlocks.length == 0 ? <span>Не удалось найти блок с именем = {this.state.searchTerm}</span> :
              filteredBlocks.map((p,i) => {
                return (
                  <Draggable key={i}>
                    <BaseBlock
                      name={p.name}
                      link={p.doc_link}
                      parameters={p.parameters}
                    />
                  </Draggable>
                );
              })
            }
          </Container>
        </div>
        <div className="container second-container">
          <div className='header-label'>Нейросеть</div>
          <button className="export-button" onClick={this.handleValidateModel}>Проверить модель</button>
          <button className="export-button" onClick={this.handleExportData}>Экспорт</button>
          <Container groupName="1" getChildPayload={i => this.state.neuralNetwork[i]} onDrop={e => this.setState({ neuralNetwork: applyDrag(this.state.neuralNetwork, e) })}>
            {
              this.state.neuralNetwork.map((p, i) => {
                return (
                  <Draggable key={i}>
                    <NeuralNetworkBlock
                      name={p.name}
                      link={p.doc_link}
                      parameters={p.parameters}
                      onDuplicate={() => this.handleDuplicateNeuralBlock(p.id)}
                      onEdit={() => this.handleEditNeuralBlock(p)}
                      onDelete={() => this.handleDeleteNeuralBlock(p.id)}

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
