import React , { createRoot } from "react";

export default function Deneme() {

  const client_id = 'e85457d1b3e94d129fc802a931095110'; // Replace with your actual Spotify client ID
const redirect_uri = 'http://localhost:3000/callback';

const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

  async function handleClick ()
  {
      const state = generateRandomString(16);
      const scope = 'user-read-private user-read-email';
  
      const queryParams = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      });
  
      const authUrl = `https://accounts.spotify.com/authorize?${queryParams.toString()}`;
  
      // Redirect the user to the Spotify authorization URL
      window.location.href = authUrl;
      console.log('Form submitted successfully');
    
  }
    return (
      <button onClick={handleClick}>
       SPOTIFY BAĞLAN
      </button>
    );
  }
  