import  { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <h2>2x Multiple: {count * 2}</h2>
      <button onClick={() => setCount(count-1)}>Decrease</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(count+1)}>Decrease</button>
    </div>
  )
}

export default App;
