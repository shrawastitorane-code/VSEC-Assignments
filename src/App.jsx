import React from 'react';
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Form from './form';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <div>
         <h1>Counter: {count}</h1>
         <h2>2x Multiple: {count * 2}</h2>
         <button onClick={() => setCount(count-1)}>Decrease</button>
         <button onClick={() => setCount(0)}>Reset</button>
         <button onClick={() => setCount(count+1)}>Decrease</button>
         <hr style={{ margin: "30px 0"}} />
         <Form />
      </div>
    </BrowserRouter>  
  )
}

export default App;
