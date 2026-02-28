import React, { Component, FormEvent } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { authFetch } from '../../helper/APIHelper';
import { UserContext } from '../../contexts/UserContext';
import logo from '../../assets/image.jpg';
import defaultProfilePic from '../../assets/defaultProfilePic.jpg';
import { useNavigate } from "react-router-dom";

type Props = {
    updateToken: (newToken: string) => void;
};

type State = {
    isLogin: boolean;
    username: string;
    email: string;
    password: string;
    nsfwOk: boolean;
    error: string;
    isSubmitting: boolean;
};

class Auth extends Component<Props & { navigate: (path: string) => void }, State> {
    static contextType = UserContext;
    context!: React.ContextType<typeof UserContext>;


    constructor(props: Props & { navigate: (path: string) => void }){
        super(props);
        this.state = {
            isLogin: true,
            username: '',
            email: '',
            password: '',
            nsfwOk: false,
            error: '',
            isSubmitting: false
        };
    }

    toggleForm = () => {
        this.setState(prev => ({
            isLogin: !prev.isLogin,
            error: ''
        }));
    };

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (this.state.isSubmitting) return;
        this.setState({ isSubmitting: true });
        const { isLogin, username, email, password, nsfwOk } = this.state;

        try {
            const url = isLogin ? '/api/users/login' : '/api/users/create';

            const body = isLogin
                ? { username, password }
                : {
                      username,
                      email,
                      password,
                      profilePic: '/uploads/defaultProfilePic.jpg',
                      nsfwOk
                  };

            const data = await authFetch(url, {
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (!data.sessionToken) {
                this.setState({ error: isLogin ? 'Login failed.' : 'Signup failed.' });
                return;
            }

            // Store token
            localStorage.setItem('token', data.sessionToken);
            this.props.updateToken(data.sessionToken);
            this.props.navigate("/home");
            // 🔥 Immediately fetch profile and update context
            const profile = await authFetch('/api/profile/me');

            this.context.setCurrentUser({
                ...profile,
                profilePic: profile.profilePic || defaultProfilePic
            });
        } catch (err) {
            console.error('Auth error', err);
            this.setState({ error: 'Request failed.' });
        } finally {this.setState({isSubmitting: false})}
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

                        <Button type="submit" color="primary" block disabled={this.state.isSubmitting}>
                        {this.state.isSubmitting
                        ? "Processing..."
                        : isLogin
                        ? "Login"
                        : "Sign Up"
                        }
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

function withRouter(Component: any) {
    return function ComponentWithRouterProp(props: any) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

export default withRouter(Auth);