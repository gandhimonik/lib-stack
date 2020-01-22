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
            isSandboxReady: props.isSandboxReady,
            sandboxUrl: props.sandboxUrl,
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
        let {data, nameWithOwner, isSandboxReady, sandboxUrl} = this.state;
        const fullImgUrl = new RegExp(/(https:\/\/github\.com\/)([a-zA-Z0-9\-_/]*)(blob)([a-zA-Z0-9\-_/]*)(\.(gif|jpeg|jpg|png))/, 'gm');
        const htmlImgUrl = new RegExp(/(src=")([\w\d-/]*)(\.(gif|jpeg|jpg|png)(\?[\w\d&=]*)?")/, 'gm');
        const hrefUrl = new RegExp(/(href=")([^#https][\w\d-/.]*)/, 'gm');

        data = data.replace(fullImgUrl, '$1$2raw$4$5');
        
        let html = this.md.render(data);
        html = html.replace(htmlImgUrl, '$1https://github.com/' + nameWithOwner + '/raw/master/$2$3');
        html = html.replace(hrefUrl, '$1https://github.com/' + nameWithOwner + '/blob/master$2');

        // Add code example
        console.log(isSandboxReady)
        if (isSandboxReady) {
            let title = html.slice(0, html.indexOf('<h', 3));
            let restOfHtml = html.slice(html.indexOf('<h', 3));
            let sandboxHtml = `<h2>Try it out</h2><iframe src="${sandboxUrl}" 
            title="Code Example" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
            style="width: 100%; height: 500px; border: 2px solid black; border-radius: 4px; overflow: hidden;"></iframe>`
            html = title + sandboxHtml + restOfHtml;
        }

        return (
            <Container fluid className="readme" dangerouslySetInnerHTML={{__html: html}}>
            </Container>
        );
    }
}

export default Markdown;