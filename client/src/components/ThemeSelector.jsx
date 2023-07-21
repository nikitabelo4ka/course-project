import React from 'react';
import {Form} from "react-bootstrap";

const ThemeSelector = ({ value, onChange }) => {

    return (
        <div style={{display: "flex", margin: "0.5vw 0 0 6vw"}}>
            <p style={{color: "white"}} className='theme-label'>Dark theme</p>
            <Form.Check id="toggler" type="switch" style={{marginLeft: "1vw"}} onClick={onChange} checked={value} readOnly/>
        </div>
    );
}

export default ThemeSelector;