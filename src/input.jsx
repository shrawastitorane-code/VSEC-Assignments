import React from 'react';
import { useNavigate } from 'react-router-dom';
function Input() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>this is the input page</h1>
            <form onSubmit={(e) => e.preventDefault()}>
               <div>
                   <label htmlFor="name">Name:</label>
                   <input type="text" id="name" name="name" required></input>
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required></input>
                </div>
                
                <div>
                    <button type="button" onClick={() => navigate("/display")}>Submit</button>
                </div>
            </form>
        </div>
    );
}
export default Input;