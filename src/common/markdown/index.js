import React, {Component} from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

import './atelier-seaside-light.min.css';
import './index.css';
import { Container } from 'semantic-ui-react';

class Markdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        };
        this.md = new MarkdownIt('default', {
            injected: true,
            html: true,
            highlight: (str, lang) => {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch(__) {}
                }
                return '';
            }
        });
    }

    render() {
        const {data} = this.state;
        const html = this.md.render(data);

        return (
            <Container fluid className="readme" dangerouslySetInnerHTML={{__html: html}}>
            </Container>
        );
    }
}

export default Markdown;