import { useState } from 'react'
import './sign_in_up.css'
import spotify_logo from './assets/spotify.svg'
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import Home from "../home/index.js"
import root from "../../index.js"
function Title(props)
{
  return (
    <div className='title'>
      <div>{props.l1}</div>
      <h3>{props.l2}</h3>
    </div>
  )
}

function PasswordChangeForm({ onBack }) {
  const [formData, setFormData] = useState({ email: '', oldPassword: '', newPassword: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/change_password', null, {
        params: {
          mail: formData.email,
          oldPass: formData.oldPassword,
          newPass: formData.newPassword
        }
      });
      console.log('Response from server:', response.data);
      alert(response.data.message);
      // Optionally, you can call onBack here to go back after a successful change
      // onBack();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={formData.oldPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Change Password</button>
      </form>
      <button onClick={onBack}>Back to Sign In</button>
    </div>
  );
}



function Verification(props)
{
  //const [code, setCode] = useState(0);
  /*const handleChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
  }*/
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send a POST request using Axios
      const code = document.getElementById('v1').value + document.getElementById('v2').value + document.getElementById('v3').value + document.getElementById('v4').value;
      const response = await axios.post('http://localhost:3000/verify?userCode=' + code + "&mail=" + props.email + "&user=" + props.username + "&pass=" + props.password);

      console.log('Response from server:', response.data);
      console.log(code);
      if(response.status === 201)
      {
        //window.location = 'sessionStart?' + 'userCode=' + code + "&mail=" + props.email + "&user=" + props.username + "&pass=" + props.password;

        const response = await axios.post('http://localhost:3000/login?name=' + props.username + "&pass=" + props.password);
        console.log(response.data.token);

        localStorage.setItem('token', response.data.token);
        root.render(<Home/>);


      }
    } catch (error) {
      //console.log(code);
      console.error('Error:', error);
    }
  }



  return (
    /*
    <div className='verification-board'>
      <form onSubmit={handleSubmit}>
        <input type="userCode" id="userCode" name="userCode" onChange={handleChange} placeholder='Verification Code' required/>
        <input type="submit" value="Verify"/>
      </form>
    </div>*/
    <div class="verification-box">
      <h2>Verify your email address</h2>
      <p class="info-text">A verification code has been sent to your email</p>
      <button class="resend-button">Resend Code</button>
      <div class="spacer"></div>
      <form onSubmit={handleSubmit}>
        <div class="verification-code-inputs">
          <input id="v1" class="verification-code" type="text" maxlength="1" required/>
          <input id="v2" class="verification-code" type="text" maxlength="1" required/>
          <input id="v3" class="verification-code" type="text" maxlength="1" required/>
          <input id="v4"class="verification-code" type="text" maxlength="1" required/>
        </div>
        <input type="submit" class="verify-button" value="Verify"/>
      </form>
    </div>
  )
}

function Form(props)
{
    const initialData = props.isSignUp ? { email: '', password: '' } : { name: '', email: '', password: '' };
    const [formData, setFormData] = useState(initialData);const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  const UsernameInput = props.isSignUp ? (<div className="form-group"><label for="email">Email</label><input type="email" id="email" name="email" onChange={handleChange} placeholder='Email' required/></div>) : ""
  const uporin = props.isSignUp ? "UP" : "IN"
  const clname = props.rot ? "login-form rotation2" : "login-form";
  const button_text = props.isSignUp ? "Sign Up" : "Sign In"
  const already_text = props.isSignUp ? "Already have an account?" : "Don't have an account?"
  const already_button =  props.isSignUp ? "Sign In" : "Sign Up"

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(props.isSignUp){
      try {
        // Send a POST request using Axios
        const response = await axios.post('http://localhost:3000/send-verification-email?userEmail=' + formData.email);
        console.log('Response from server:', response.data);
        if(response.status === 201)
        {
          //pick here the verification board
          document.querySelector('.login-form').remove();
          ReactDOM.createRoot(document.querySelector('.mini-body')).render(<Verification email={formData.email} username={formData.username} password={formData.password}/>);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else
    {
      try {
        // Send a POST request using Axios
        const response = await axios.post('http://localhost:3000/login?name=' + formData.username + '&pass='+ formData.password);
        console.log('Response from server:', response.data);
        if(response.status === 201)
        {
          //pick here the verification board
          //document.querySelector('.login-form').remove();
          //const response = await axios.post('http://localhost:3000/login?name=' + props.username + "&pass=" + props.password);
          console.log(response.data.token);
  
          localStorage.setItem('token', response.data.token);
          root.render(<Home/>);
      }
      } catch (error) {
        console.error('Error:', error);
      }
    }



  }



  return(
    <div className='login-container'>
    <div className={clname}>
      <div className='upper-body'>
        <Title l1="Sign" l2={uporin}/>
        <form className="login" onSubmit={handleSubmit}>
          {UsernameInput}
          <div className="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" onChange={handleChange} placeholder='Username' required/>
          </div>
          
          <div className="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" onChange={handleChange} placeholder='Password' required/>
          </div>
          <div className="login-button">
              <input type="submit" value={button_text}/>
          </div>
        </form>
        <Or/>
        <SpotifyLogin/>
      </div>
      <div className='lower-body'>
        
          <Already prompt={already_text} link={already_button} isSignUp={props.isSignUp}/>


      </div>
      {!props.isSignUp && (
          <button onClick={props.onForgotPassword} className="forgot-password-button">
            Forgot Password?
          </button>
        )}
    </div>
    </div>
  )
}

function Or()
{
  return (
    <div className='or'>
      <div className='line'/>
      <span>OR</span>
      <div className='line'/>
    </div>
  )
}

function SpotifyLogin()
{
  return (
    <button className='spotify-login'>
      <img src={spotify_logo} alt='spotify'/>
      <div>Sign up using Spotify</div>
    </button>
  )
}

function Already(props)
{
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  //const nav = useNavigate();
  function handleClick()
  {
    /*if(props.isSignUp) {nav('/signin');}
    else {nav('/signup');}*/
    setIsButtonDisabled(true);
    let loginForm = document.querySelector('.login-form');
    loginForm.classList.toggle('rotation1');
    setTimeout(function () {
      loginForm.remove();
      ReactDOM.createRoot(document.querySelector('.login-container')).render(<Form isSignUp={!props.isSignUp} rot={true}/>);
      setTimeout(function () {
      document.querySelector('.login-form').classList.toggle('rotation3');
      }, 100);
      setTimeout(function () {
        document.querySelector('.login-form').classList.remove('rotation1');
        document.querySelector('.login-form').classList.remove('rotation2');
        document.querySelector('.login-form').classList.remove('rotation3');
        setIsButtonDisabled(false);
      }, 2000);
    }, 3000);
    
  }
  return (
    <div className='already-container'>
      <div>{props.prompt}</div>
      <button onClick={handleClick} disabled={isButtonDisabled}>{props.link}</button>
    </div>
  )
}

function Navbar()
{
  return(
    <div className='navbar'>
      <div className='site-name'>HarmoniScape</div>
    </div>
  )
}

function SignInUp() {
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handleShowPasswordChange = () => setShowPasswordChange(true);
  const handleHidePasswordChange = () => setShowPasswordChange(false);

  return (
    <>
      <Navbar/>
      <div className="mini-body">
        <div className='sider'/>
        {showPasswordChange ? (
          <PasswordChangeForm onBack={handleHidePasswordChange}/>
        ) : (
          <Form
            isSignUp={false}
            onForgotPassword={handleShowPasswordChange}
          />
        )}
        <div className='sider'/>
      </div>
    </>
  );
}


export default SignInUp
