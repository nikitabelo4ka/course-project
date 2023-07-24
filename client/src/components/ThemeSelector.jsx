import React from 'react';
import {Form} from "react-bootstrap";

const ThemeSelector = ({ value, onChange }) => {

    return (
        <div className='theme-selector-wrapper'>
            <p className='theme-selector-text'>Dark theme</p>
            <Form.Check id="toggler" type="switch" className='theme-selector-switch' onClick={onChange} checked={value} readOnly/>
        </div>
    );
}

export default ThemeSelector;