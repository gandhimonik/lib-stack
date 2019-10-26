import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import config from '../../config';

export const AuthContext = React.createContext();
firebase.initializeApp(config);

class AuthProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            user: null,
            history: props.history,
        };
        this.firebase = firebase;
        this.provider = new this.firebase.auth.GithubAuthProvider();
        this.provider.addScope('repo');
        this.provider.setCustomParameters({
            'allow_signup': 'false',
        });
        this.db = this.firebase.firestore();
    }

    componentDidMount() {
        this.unsubscribe = this.firebase
            .auth()
            .onAuthStateChanged(user => {
                if (user) {
                    console.log('auth exists', user);
                    this.getToken(user);
                } else {
                    console.log('redirecting for auth');
                    this.firebase.auth().signInWithRedirect(this.provider);
                }
            });
    }

    getToken(user) {
        return this.db
            .doc(`users/${user.uid}`)
            .get()
            .then(doc => {
                if (doc.exists) {
                    const {token} = doc.data();
                    this.setState({
                        token,
                        user
                    });
                } else {
                    this.firebase
                        .auth()
                        .getRedirectResult()
                        .then(result => {
                            if (result.credential) {
                                console.log(result);
                                this.setState({
                                    token: result.credential.accessToken,
                                    user: result.user,
                                });
                                this.saveToken(this.state.user, this.state.token);
                            }
                        })
                        .catch(error => console.log(error));
                }
                
            });
        
    }

    saveToken(user, token) {
        this.db
            .doc(`users/${user.uid}`)
            .set({
                email: user.email,
                name: user.displayName,
                token: token,
            });
    }

    signOut() {
        this.firebase
            .auth()
            .signOut()
            .then(res => {
                console.log('signed out');
                this.unsubscribe();
                window.location.href = "https://www.google.com";
            })
            .catch(err => console.log(err));
    }

    render() {
        if (this.state.token) {
            return (
                <AuthContext.Provider value={{token: this.state.token, user: this.state.user, signOut: () => this.signOut()}}>
                    {this.props.children}
                </AuthContext.Provider>
            );
        } else {
            return <div>Signing in...</div>
        }
    }
}

export default AuthProvider;