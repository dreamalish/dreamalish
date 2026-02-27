import React, { Component, FormEvent } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { authFetch } from '../../helper/APIHelper';
import logo from '../../assets/image.jpg'; 
import defaultProfilePic from '../../assets/defaultProfilePic.jpg'; // default avatar

type Props = {
    updateToken: (newToken: string) => void;
    updateUser: (user: any) => void; // add a prop to update global user state
};

type State = {
    isLogin: boolean;
    username: string;
    email: string;
    password: string;
    nsfwOk: boolean;
    error: string;
};

export default class Auth extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLogin: true,
            username: '',
            email: '',
            password: '',
            nsfwOk: false,
            error: ''
        };
    }

    toggleForm = () => {
        this.setState(prev => ({
            isLogin: !prev.isLogin,
            error: ''
        }));
    };

    handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { isLogin, username, email, password, nsfwOk } = this.state;

        try {
            const url = isLogin ? '/api/users/login' : '/api/users/create';

            const body = isLogin
                ? { username, password }
                : { 
                    username, 
                    email, 
                    password, 
                    profilePic: defaultProfilePic, // assign default automatically
                    nsfwOk 
                  };

            const data = await authFetch(url, {
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (data.sessionToken && data.user) {
                // store token
                localStorage.setItem('token', data.sessionToken);
                this.props.updateToken(data.sessionToken);

                // update user immediately (for SiteNav)
                this.props.updateUser(data.user);
            } else {
                this.setState({ error: isLogin ? 'Login failed.' : 'Signup failed.' });
            }
        } catch (err) {
            console.error('Auth error', err);
            this.setState({ error: 'Request failed.' });
        }
    };

    render() {
        const { isLogin, username, email, password, nsfwOk, error } = this.state;

        return (
            <div className="auth-wrapper">
                <div className="auth-box">
                    <img src={logo} alt="Dreamalish Logo" className="auth-logo" />

                    <h3>{isLogin ? 'Login' : 'Sign Up'}</h3>

                    <Form onSubmit={this.handleSubmit}>
                        {!isLogin && (
                            <>
                                <FormGroup>
                                    <Label>Username</Label>
                                    <Input
                                        value={username}
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={e => this.setState({ email: e.target.value })}
                                    />
                                </FormGroup>

                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            checked={nsfwOk}
                                            onChange={() => this.setState({ nsfwOk: !nsfwOk })}
                                        />{' '}
                                        NSFW content OK?
                                    </Label>
                                </FormGroup>
                            </>
                        )}

                        {isLogin && (
                            <FormGroup>
                                <Label>Username</Label>
                                <Input
                                    value={username}
                                    onChange={e => this.setState({ username: e.target.value })}
                                />
                            </FormGroup>
                        )}

                        <FormGroup>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={e => this.setState({ password: e.target.value })}
                            />
                        </FormGroup>

                        <Button type="submit" color="primary" block>
                            {isLogin ? 'Login' : 'Sign Up'}
                        </Button>
                    </Form>

                    {error && <p className="auth-error">{error}</p>}

                    <Button color="link" onClick={this.toggleForm}>
                        {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                    </Button>
                </div>
            </div>
        );
    }
}
