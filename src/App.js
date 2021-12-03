import React, { useState } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { signInWithPopup, signOut } from "firebase/auth";


initializeApp(firebaseConfig);
function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photo: '',
    error: '',
    success: ''
  });
  const provider = new GoogleAuthProvider();
  const handleSingIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        GoogleAuthProvider.credentialFromResult(result);
        const { displayName, photoURL, email } = result.user;
        const isSignedIn = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(isSignedIn)
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  const handleSingOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      const isSignOut = {
        isSignIn: false,
        name: '',
        email: '',
        photo: ''
      }
      setUser(isSignOut);
    }).catch((error) => {
      console.log(error.message);
    });
  }
  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.value === "password") {
      const passwordLength = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = passwordLength && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((result) => {
        const newUserInfo = { ...user };
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
      })
      .catch((error) => {
        const newUserInfo = { ...user };
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    e.preventDefault();
  }

  return (
    <div className="App">
      {
        user.isSignIn
          ? <button onClick={handleSingOut}>Sign Out</button>
          : <button onClick={handleSingIn}>Sign In</button>
      }
      {user.isSignIn &&
        <div>
          <h2>Welcome, {user.name}</h2>
          <h4>Email: {user.email}</h4>
          <img src={user.photo} alt="img" />
        </div>}

      <h1>Out won authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" onBlur={handleBlur} name="name" placeholder="Your name" />}
        <br />
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your email" required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="Your password" required />
        <br />
        <input type="submit" value="submit" />
      </form>
      <p style={{ color: "red" }}>{user.error}</p>
      {user.success && <p style={{ color: "green" }}>User {newUser ? "created" : "logged In"} Successfully</p>}
    </div>
  );
}

export default App;
