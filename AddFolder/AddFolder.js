import React from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import NotefulContext from '../NotefulContext/NotefulContext'
import config from '../config'
import FolderValidationError from './FolderValidationError'
import NotefulError from '../NotefulError/NotefulError'
import PropTypes from 'prop-types';




  export default class AddFolder extends React.Component {
    static defaultProps = {
      history: {
        push: () => {}
      }
  }
  static contextType = NotefulContext;
  
  handleSubmit= e => {
    e.preventDefault()
    const folder = {
      name: e.target['folder-name'].value,
    }
    fetch(`http://localhost:9090/folders/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder)
    })
    .then(res => {
      if (!res.ok)
        return res.json().then(e => Promise.reject(e))
      return res.json()
    })
    .then(folder => {
      console.log('ts', this.context)
      this.context.addFolder(folder)
      this.props.history.push(`/folder/${folder.id}`)
    })
    .catch(error => {
      console.error('add folder ',{ error })
    })
  }
  
    render() {
      return (
        <section className='AddFolder'>
          <h2>Create a folder</h2>
          <NotefulForm onSubmit={this.handleSubmit}>
            <div className='field'>
              <label htmlFor='folder-name-input'>
                Name
              </label>
              <input type='text' id='folder-name-input' name='folder-name' required/>
            </div>
            <div className='buttons'>
              <button type='submit'>
                Add new folder
              </button>
            </div>
          </NotefulForm>
        </section>
      )
    }
  }