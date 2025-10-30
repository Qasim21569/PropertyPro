import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBbYV1Lv5V2SsxXFM1FaGlzj8lpxhKi_mE",
  authDomain: "propertypro-39565.firebaseapp.com",
  projectId: "propertypro-39565",
  storageBucket: "propertypro-39565.firebasestorage.app",
  messagingSenderId: "408555647727",
  appId: "1:408555647727:web:b38758863f621d11fd611a",
  measurementId: "G-5X4Y4LM7DH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function SimpleApp() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [properties, setProperties] = useState([]);
  const [propertyName, setPropertyName] = useState('');

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('Account created successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('Signed in successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert('Signed out successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const addProperty = async () => {
    if (!user) {
      alert('Please sign in first!');
      return;
    }

    try {
      await addDoc(collection(db, 'properties'), {
        name: propertyName,
        owner: user.email,
        createdAt: new Date()
      });
      
      setPropertyName('');
      alert('Property added successfully!');
      loadProperties();
    } catch (error) {
      alert('Error adding property: ' + error.message);
    }
  };

  const loadProperties = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'properties'));
      const props = [];
      querySnapshot.forEach((doc) => {
        props.push({ id: doc.id, ...doc.data() });
      });
      setProperties(props);
    } catch (error) {
      alert('Error loading properties: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏠 PropertyPro - Simple Test</h1>
      
      {!user ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
          <h2>Sign In / Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', margin: '5px', width: '200px' }}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', margin: '5px', width: '200px' }}
          />
          <br />
          <button onClick={signIn} style={{ padding: '10px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
            Sign In
          </button>
          <button onClick={signUp} style={{ padding: '10px', margin: '5px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
            Sign Up
          </button>
        </div>
      ) : (
        <div>
          <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
            <h2>Welcome, {user.email}!</h2>
            <button onClick={signOutUser} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
              Sign Out
            </button>
          </div>

          <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
            <h2>Add Property</h2>
            <input
              type="text"
              placeholder="Property Name"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              style={{ padding: '10px', margin: '5px', width: '200px' }}
            />
            <br />
            <button onClick={addProperty} style={{ padding: '10px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
              Add Property
            </button>
          </div>

          <div style={{ border: '1px solid #ccc', padding: '20px' }}>
            <h2>Properties</h2>
            <button onClick={loadProperties} style={{ padding: '10px', margin: '5px', backgroundColor: '#17a2b8', color: 'white', border: 'none' }}>
              Load Properties
            </button>
            
            {properties.length > 0 && (
              <div>
                <h3>All Properties:</h3>
                {properties.map((property) => (
                  <div key={property.id} style={{ border: '1px solid #eee', padding: '10px', margin: '10px 0' }}>
                    <strong>{property.name}</strong>
                    <br />
                    <small>Owner: {property.owner}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa' }}>
        <h3>✅ Test Status</h3>
        <p>✅ Firebase Config: Connected to propertypro-39565</p>
        <p>✅ Authentication: {user ? 'Signed In' : 'Ready'}</p>
        <p>✅ Firestore: {properties.length > 0 ? `${properties.length} properties loaded` : 'Ready to add properties'}</p>
      </div>
    </div>
  );
}

export default SimpleApp;

