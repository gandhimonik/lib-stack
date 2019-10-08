import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Logo from '../logo';
import * as routes from '../../routes';

import './index.css';
import SearchForm from '../search-form';

class GlobalHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            navLink: '/lib-stack/search',
            npmResults: [],
            withSearch: this.props.withSearch,
            history: this.props.history,
        };
    }

    onSubmit = (e, query) => {
        e.preventDefault();
        this.props.history.push(this.state.navLink + "?query=" + query);
        this.setState({
            query
        });
    }

    render() {
        const withSearch = this.state.withSearch;

        return (
            <Menu inverted secondary className="thunder global header">
                <Menu.Item name="home">
                    <Link to={routes.HOME}><Logo size={'medium'} /></Link>
                </Menu.Item>

                {withSearch && 
                <Menu.Menu position="right" className="search">
                    <Menu.Item name="home">
                        <SearchForm onSubmit={this.onSubmit} query={this.state.query} isLite={true} />
                    </Menu.Item>
                </Menu.Menu>
                }
            </Menu>
        )
    }
}

export default GlobalHeader;