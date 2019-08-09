import React from 'react'
import { List } from 'semantic-ui-react';

const Footer = ({format}) => (
    <List horizontal className={"footer" + (format ? ' ' + format : '')}>
        <List.Item className="copyright">© 2019</List.Item>
        <List.Item className="link">
            <a href="https://twitter.com/MonikKGandhi" target="_blank" rel="noopener noreferrer">Twitter</a>
        </List.Item>
    </List>
);

export default Footer;