import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';


firebase.initializeApp(firebaseConfig);

function App() {

const [user, setUser] = useState({
  isSignedIn: false,
  name: '',
  email: '',
  photo: ''
})
const provider = new firebase.auth.GoogleAuthProvider();
const handleSignIn = ()=>{
  firebase.auth().signInWithPopup(provider)
  .then(res =>{
    const {displayName, photoURL, email}=res.user;
    const signedInUser = {
      isSignedIn: true,
      name: displayName,
      email: email,
      photo: photoURL
    }
    setUser(signedInUser);
    console.log(displayName, email, photoURL);
  })
  .catch(err =>{
    console.log(err);
    console.log(err.message);
  })
}

const handleSignOut = ()=>{
  firebase.auth().signOut()
  .then(res => {
    // Sign-out successful.
    const signedOutUser={
      isSignedIn: false,
      name: '',
      photo: '',
      email: '',
      password: '',
      error: '',
      isValid: false,
      existingUser: false
    }
    setUser(signedOutUser);
  })
  .catch(err=> {
    // An error happened.

  })
}
const is_valid_email = function(email) { return /^.+@.+\..+$/.test(email); }
const hasNumber = input => /\d/.test(input);

const switchForm = event =>{
  const createUser = {...user};
  createUser.existingUser = event.target.checked;
  setUser(createUser);
}

const handleChange = even =>{
  const newUserInfo = {
    ...user
  };


  // Perform validation

  let isValid
  if(even.target.name==='email'){
    isValid = is_valid_email(even.target.value);
  }
  if(even.target.name=== 'password'){
    isValid = even.target.value.length>8 && hasNumber(even.target.value);
  }

  newUserInfo[even.target.name] = even.target.value;
  newUserInfo.isValid = isValid;
  setUser(newUserInfo);
}
const createAccount = (event) => {
  if(user.isValid){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res => {
      console.log(res);
      const createUser = {...user};
      createUser.isSignedIn = true;
      createUser.error = '';
      setUser(createUser);
    })
    .catch(err => {
      console.log(err.message);
      const createUser = {...user};
      createUser.isSignedIn = false;
      createUser.error = err.message;
      setUser(createUser);
    })
  }
  event.preventDefault();
  event.target.reset();
  
}
const signInUser = event =>{
  if(user.isValid){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
      console.log(res);
      const createUser = {...user};
      createUser.isSignedIn = true;
      createUser.error = '';
      setUser(createUser);
    })
    .catch(err => {
      console.log(err.message);
      const createUser = {...user};
      createUser.isSignedIn = false;
      createUser.error = err.message;
      setUser(createUser);
    })
  }
  event.preventDefault();
  event.target.reset();
}
  return (
    <div className="App">

        {
          user.isSignedIn ? <button onClick={handleSignOut} >Sign Out</button>:
          <button onClick={handleSignIn} >Sign In</button>
        }
      
        {
          user.isSignedIn && 
          <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
          </div>
        }
        <h1>Our own Authentication</h1>
        <label htmlFor="switchForm"> Returning User
        <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
        </label>
        <form style={{display:user.existingUser ? 'block':'none'}} onSubmit={signInUser}> 
        <input type="text" onBlur={handleChange} name='email' placeholder='Your Email' required/>
        <br></br>
        <input type="password" onBlur={handleChange} name='password' placeholder='Your Password' required/>
        <br></br>
        <input type="submit" value="SignIn"/>
        </form>
        <form style={{display:user.existingUser ? 'none':'block'}} onSubmit={createAccount}> 
        <input type="text" onBlur={handleChange} name='name' placeholder='Your Name' required/>
        <br></br>
        <input type="text" onBlur={handleChange} name='email' placeholder='Your Email' required/>
        <br></br>
        <input type="password" onBlur={handleChange} name='password' placeholder='Your Password' required/>
        <br></br>
        <input type="submit" value="Create Account"/>
        </form>
        {
          user.error && <p style={{color:'red'}}>{user.error}</p>
        }
    </div>
  );
}

export default App;
