import React, {Component} from 'react';
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import hljs from 'highlight.js';

import './atelier-seaside-light.min.css';
import './index.css';
import { Container } from 'semantic-ui-react';

class Markdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            nameWithOwner: props.nameWithOwner,
        };
        this.md = new MarkdownIt('default', {
            injected: true,
            html: true,
            linkify: true,
            highlight: (str, lang) => {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch(__) {}
                }
                return '';
            }
        });
        this.md.use(MarkdownItAnchor, {
            level: [1, 2, 3, 4],
            slugify: s => s.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
        });
    }

    render() {
        let {data, nameWithOwner} = this.state;
        const fullImgUrl = new RegExp(/(https:\/\/github\.com\/)([a-zA-Z0-9\-_/]*)(blob)([a-zA-Z0-9\-_/]*)(\.(gif|jpeg|jpg|png))/, 'gm');
        const htmlImgUrl = new RegExp(/(src=")([\w\d-/]*)(\.(gif|jpeg|jpg|png)(\?[\w\d&=]*)?")/, 'gm');
        const hrefUrl = new RegExp(/(href=")([^#https][\w\d-/.]*)/, 'gm');

        data = data.replace(fullImgUrl, '$1$2raw$4$5');
        console.log(data);

        let html = this.md.render(data);
        html = html.replace(htmlImgUrl, '$1https://github.com/' + nameWithOwner + '/raw/master/$2$3');
        html = html.replace(hrefUrl, '$1https://github.com/' + nameWithOwner + '/blob/master$2');

        return (
            <Container fluid className="readme" dangerouslySetInnerHTML={{__html: html}}>
            </Container>
        );
    }
}

export default Markdown;