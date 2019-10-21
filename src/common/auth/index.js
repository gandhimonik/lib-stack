import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import config from '../../config';

export const AuthContext = React.createContext();
firebase.initializeApp(config);

class AuthProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
        };
        this.firebase = firebase;
        this.provider = new this.firebase.auth.GithubAuthProvider();
        this.provider.addScope('repo');
        this.provider.setCustomParameters({
            'allow_signup': 'false',
        });
        console.log(this.provider);
    }

    componentDidMount() {
        this.firebase
            .auth()
            .getRedirectResult()
            .then(result => {
                if (result.credential) {
                    this.setState({
                        token: result.credential.accessToken,
                    });
                } else {
                    this.firebase.auth().signInWithRedirect(this.provider);
                }
            })
            .catch(error => console.log(error));
    }

    render() {
        if (this.state.token) {
            return (
                <AuthContext.Provider value={{token: this.state.token}}>
                    {this.props.children}
                </AuthContext.Provider>
            );
        } else {
            return <div>Signing in...</div>
        }
    }
}

export default AuthProvider;