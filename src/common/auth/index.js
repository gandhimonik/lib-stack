import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import config from '../../config';
import { Loader } from 'semantic-ui-react';

export const AuthContext = React.createContext();
firebase.initializeApp(config());

class AuthProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            user: null,
            history: props.history,
        };
        this.firebase = firebase;
        this.db = this.firebase.firestore();
        const authId = process.env.NODE_ENV === 'production' ? 'lHKKj0XvvQHFHqgEvTwf' : 'WdDnpiHcUIhnMTw7kDMu';
        this.getToken(authId);
    }

    getToken(authId) {
        this.db
            .doc(`auth/${authId}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    const {token} = doc.data();
                    this.setState({
                        token
                    });
                }
            });
    }

    render() {
        if (this.state.token) {
            return (
                <AuthContext.Provider value={{token: this.state.token}}>
                    {this.props.children}
                </AuthContext.Provider>
            );
        } else {
            return  <Loader active>Loading</Loader>
        }
    }
}

export default AuthProvider;
