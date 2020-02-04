import React, { Component } from 'react';
import { Menu, Image, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Logo from '../logo';
import * as routes from '../../routes';

import './index.css';
import SearchForm from '../search-form';
import profileImg from '../../images/profile.svg';

class GlobalHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            navLink: '/lib-stack/search',
            npmResults: [],
            withSearch: this.props.withSearch,
            history: this.props.history,
            user: null,
        };
    }

    componentDidMount() {
        // const {user, signOut} = this.context;
        this.setState({
            query: '',
            navLink: '/search',
            npmResults: [],
            withSearch: this.props.withSearch,
            withoutLogo: this.props.withoutLogo,
            noBackground: this.props.noBackground,
            history: this.props.history,
            // user: user,
            // signOut: signOut,
        });
    }

    onSubmit = (e, query) => {
        e.preventDefault();
        this.props.history.push(this.state.navLink + "?query=" + query);
        this.setState({
            query
        });
    }

    onChange = (e, data) => {
        if (data.value === 'sign-out') {
            this.state.signOut();
        }
    }

    render() {
        const {withSearch, withoutLogo, user} = this.state;

        const trigger = (
            <span>
                {user && user.photoURL &&
                    <Image className={'profile'} src={user.photoURL} />
                }
                {user && !user.photoURL &&
                    <Image className={'profile'} src={profileImg} />
                }
            </span>
        );

        const options = [
            { key: 'user', text: user ? user.displayName : null, disabled: true},
            { key: 'sign-out', text: 'Sign Out', value: 'sign-out'}
        ]

        return (
            <Menu
                inverted
                secondary
                className="thunder global header"
                style={{backgroundColor: this.state.noBackground ? 'white' : 'auto'}}>
                {!withoutLogo &&
                    <Menu.Item name="home">
                        <Link to={routes.HOME}><Logo size={'medium'} /></Link>
                    </Menu.Item>
                }

                {withSearch &&
                    <Menu.Menu position="right" className="search">
                        <Menu.Item name="home">
                            <SearchForm onSubmit={this.onSubmit} query={this.state.query} isLite={true} />
                        </Menu.Item>
                    </Menu.Menu>
                }

                {user &&
                    <Menu.Menu position="right" className="profile">
                        <Menu.Item name="profile">
                            <Dropdown
                                trigger={trigger}
                                options={options}
                                pointing={"top right"}
                                icon={null}
                                onChange={this.onChange}
                                selectOnBlur={false} />
                        </Menu.Item>
                    </Menu.Menu>
                }
            </Menu>
        )
    }
}

export default GlobalHeader;
