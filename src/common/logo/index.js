import React from 'react';
import { Header } from 'semantic-ui-react';

import './style.css';

const Logo = ({size}) => (
    <Header 
        size={size}
        className="logo"
    >
        <span className="first">Lib</span><span className="second">Stack</span>
    </Header>
);

export default Logo;