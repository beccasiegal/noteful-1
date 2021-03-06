import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import NotefulContext from '../NotefulContext/NotefulContext'
import config from '../config'
import NoteValidationError from './NoteValidationError'
import NotefulError from '../NotefulError/NotefulError'
import PropTypes from 'prop-types';
import './AddNote.css'


export default class AddNote extends Component {
  constructor(props){
    super(props);
    this.state = {
      nameValid: false,
      name: '',
      validationMessages: {
        name: '',
      }
    }
  }
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = NotefulContext;

  validateName(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.name = 'Name is required';
      hasError = true;
    }
    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    }, this.formValid );
}

  formValid(){
    this.setState({
      formValid: this.state.nameValid
    });
  }
  updateName(name){
    this.setState({name}, ()=>{this.validateName(name)});
  }
  handleSubmit = e => {
    e.preventDefault()
    const note = {
      name: e.target['note-name'].value,
      content: e.target['note-content'].value,
      folderId: e.target['note-folder-id'].value,
      modified: new Date(),
    }
    fetch('http://localhost:8000/api/notes/', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(note)
    })
    .then(res => {
      if(!res.ok)
        return res.json().then(e => Promise.reject(e))
      return res.json()
    })
    .then(note => {
      this.context.addNote(note)
      this.props.history.push(`./note/${note.id}`)
    })
    .catch(error => {
      console.log('add note ', {error})
    })
    .finally( alert("Note Added!") )
  }

  render() {
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input aria-label='Name of Note' type='text' id='note-name-input' name='note-name' onChange={e => this.updateName(e.target.value)} required/>
            <NoteValidationError className='validationError' hasError={!this.state.name} message={this.state.validationMessages.name}></NoteValidationError>
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content' aria-label='Content of Note'/>
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id' required> 
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit' >
              Add new note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
