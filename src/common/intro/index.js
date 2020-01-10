import React from 'react';
import {Link} from 'react-router-dom';
import { Header, Container } from 'semantic-ui-react';

import './index.css';
import profileImg from '../../images/profile.svg';

const Intro = (props) => (
    <div style={{ marginLeft: '1rem', marginTop: '1rem' }}>
        <Container fluid className="title">
            {props.isLink &&
                <Link to={props.nameWithOwner} className="repo link">
                    <Header as="h2">{props.name}</Header>
                </Link>
            }

            {!props.isLink &&
                <Header as="h2">{props.name}</Header>
            }

            <Container fluid className="profile">
                <img className="avatar" src={props.avatar || profileImg} alt="Avatar not found" />
                <Header as="h5" className="owner">{props.owner}</Header>
                <Header as="h5" className="version">published {props.version}</Header>
                <Header as="h5" className="date">{props.date}</Header>
            </Container>
        </Container>
        <Container fluid className="description">
            <p className="repo desc" dangerouslySetInnerHTML={{__html: props.description}}></p>
        </Container>
    </div>

);

export default Intro;
