
import React , { createRoot } from "react";
import './styles.css'
import { useState } from 'react';

import GooglePicker from 'react-google-picker';

const GoogleDrivePicker = () => {
  // Replace 'your-google-api-key' with your actual Google API key
  const developerKey = 'your-google-api-key';
  const clientId = 'your-client-id';

  const onSelect = (data) => {
    if (data.docs && data.docs.length > 0) {
      const selectedFile = data.docs[0];
      console.log('Selected File:', selectedFile);
      // Handle the selected file, e.g., save it to state or send it to the backend
    }
  };

  return (
    <GooglePicker
      clientId={clientId}
      developerKey={developerKey}
      scope={['https://www.googleapis.com/auth/drive.file']}
      onChange={onSelect}
    >
      <button>Select File from Google Drive</button>
    </GooglePicker>
  );
};



function JsonFileDropzone () {
  const [file, setFile] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile && droppedFile.type === 'application/json') {
      const reader = new FileReader();
      reader.readAsText(droppedFile);
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          // Do something with the JSON data, e.g., set it in state
          setFile(JSON.stringify(jsonData));
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };

      
      
    } else {
      console.error('Please drop a valid JSON file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = async () => 
  {
    try {
      // Send POST request to localhost:3000
      console.log(file);
      const response = await fetch('http://localhost:3000/add_song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  }

  return (
    <div className="json-upload-container">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="json-upload"
      >
        {file ? (
          <p>File uploaded: {file}</p>
        ) : (
          <p>Drag and drop a JSON file here</p>
        )}
      </div>
      <button onClick={handleClick}>Upload</button>

      <GoogleDrivePicker />
    </div>

  );
};

const Form = () => {
  const [elements, setElements] = useState([
    { id: 1, type: 's_title' },
    { id: 2, type: 's_artist' },
    { id: 3, type: 's_album' },
    { id: 4, type: 's_genre' },
  ]);

  const handleClick = (id, e) => {
    e.preventDefault();
    const newElements = [...elements];
    const index = newElements.findIndex((el) => el.id === id);

    if (index !== -1) {
      // Clone the element and generate a new unique ID
      const newElement = { ...newElements[index], id: Date.now(), type: newElements[index].type };
      newElements.splice(index + 1, 0, newElement);

      // Update state with the new elements array
      setElements(newElements);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let title, artists = [], albums = [], genres = [], rating;
    
    title = e.target['s_title'].value;

    if(e.target[`s_artist`].length)
    {
      for(let i = 0; i < e.target[`s_artist`].length; i++)
      {
        if(e.target[`s_artist`][i].value.trim())
        artists.push(e.target[`s_artist`][i].value.trim())
      }
    }
    else  artists.push(e.target[`s_artist`].value)
    
    if(e.target[`s_album`].length)
    {
      for(let i = 0; i < e.target[`s_album`].length; i++)
      {
        if(e.target[`s_album`][i].value.trim())
          albums.push(e.target[`s_album`][i].value.trim())
        
      }
    }
    else  albums.push(e.target[`s_album`].value)

    if(e.target[`s_genre`].length)
    {
      for(let i = 0; i < e.target[`s_genre`].length; i++)
      {
        if(e.target[`s_genre`][i].value.trim())
        genres.push(e.target[`s_genre`][i].value.trim())
      }
    }
    else  genres.push(e.target[`s_genre`].value)

    rating = e.target['s_rating'].value;
        
    let songList = [];
    songList.push({"title": title, "artists": artists,  "albums" : albums,"genres": genres, "rating": rating});

    // Prepare the request body
    const requestBody = {
      songList,
    };

    console.log(JSON.stringify(requestBody));

    try {
      // Send POST request to localhost:3000
      const response = await fetch('http://localhost:3000/add_song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };
  return (
    <div className="manual-upload-container">
    <form onSubmit={handleSubmit} className="manual-upload">
      {elements.map((element) => (
        <div key={element.id} className={element.type}>
          <label htmlFor={element.type}>{element.type.substring(2)}</label> <br/>
          <input type="text" name={element.type} placeholder={element.type.substring(2)} />
          {element.type !== 's_title' && (
            <button onClick={(e) => handleClick(element.id, e)}>+</button>
          )}
        </div>
      ))}
      <div>
        <label htmlFor="s_rating">rating</label> <br/>
        <input type="text" name="s_rating" placeholder="rating" />
      </div>
      <input type="submit" value="Add" />
    </form>
    </div>
  );
};





export default function Add() {
  return(
    <div className="add-body">    
      <Form/>
      <JsonFileDropzone/>
    </div>
  );
}