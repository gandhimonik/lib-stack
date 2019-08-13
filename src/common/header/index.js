import React from 'react';
import { Menu, Input } from 'semantic-ui-react';
import Logo from '../logo';

import './index.css';

const GlobalHeader = ({withSearch}) => (
    <Menu inverted secondary className="thunder global header">
        <Menu.Item name="home">
            <Logo size={'medium'} />
        </Menu.Item>

        {withSearch && 
        <Menu.Menu position="right" className="search">
            <Menu.Item name="home">
                <Input className="search wrapper" icon="search" placeholder="Search Libraries..." />
            </Menu.Item>
        </Menu.Menu>
        }
    </Menu>
);

export default GlobalHeader;