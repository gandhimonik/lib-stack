import React from 'react'
import { List } from 'semantic-ui-react';

const Footer = ({format}) => (
    <List horizontal size={"large"} className={"footer" + (format ? ' ' + format : '')}>
        <List.Item className="copyright">© 2020</List.Item>
        <List.Item className="link">
            <a href="https://github.com/gandhimonik/lib-stack/issues" target="_blank" rel="noopener noreferrer">Have Feedback?</a>
        </List.Item>
        <List.Item className="link">
            <a href="https://twitter.com/MonikKGandhi" target="_blank" rel="noopener noreferrer">Twitter</a>
        </List.Item>
    </List>
);

export default Footer;
