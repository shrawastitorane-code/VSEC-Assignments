
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Input from './input';
import Display from './Display';
function Form() {
    return (
        
          <Routes>
            <Route path="/" element={<Input />} />
            <Route path="/display" element={<Display />} />
          </Routes>
        
    );
}
export default Form;