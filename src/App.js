import React, { useState, useEffect} from 'react'
import { Amplify } from 'aws-amplify'
import { Storage } from 'aws-amplify'



import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', description: '' }

const App = ({ signOut, user }) => {
  const [formState, setFormState] = useState(initialState)


  
  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }
  const [images, setImages] = useState([])
  useEffect(() => {
    fetchImages()
  }, [])
  async function fetchImages() {
    let imageKeys = await Storage.list('')
    console.log(imageKeys)
    imageKeys = await Promise.all(imageKeys.results.map(async k => {
      const key = await Storage.get(k.key)
      return key
    }))
    console.log('imageKeys: ', imageKeys)
    setImages(imageKeys)
  }
  async function onChange(e) {
    const file = e.target.files[0];
    const result = await Storage.put(file.name, file, {
      contentType: 'image/png'
    })
    console.log({ result })
    fetchImages()
  }


return (
  <div style={styles.container}>
    
    
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        {
          images&&images.map(image => (
            <img
              src={image}
              key={image}
              style={{width: 500, height: 300}}
            />
          ))
        }
      </div>
      <Button onClick={signOut} style={styles.button}>Sign out</Button>
      <input
        type="file"
        onChange={onChange}
      />
    

   
  </div>
)
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: { marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App);