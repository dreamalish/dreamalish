import React, { FormEvent } from 'react';
import { Form, FormGroup, Label, Button, Input } from 'reactstrap';
import APIURL from '../../helper/Environment';


type Props = {
  updateToken: (newToken: string) => void;
};

type State = {
  username: string;
  password: string;
  error: string;
};

export default class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { username, password } = this.state;

    if (!username || !password) {
      this.setState({ error: 'Please enter both username and password.' });
      return;
    }

    try {
      const response = await fetch(`${APIURL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      // If backend crashed or returned HTML, stop here
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();

      if (data.sessionToken) {
        localStorage.setItem('token', data.sessionToken);
        this.props.updateToken(data.sessionToken);
      } else {
        this.setState({ error: data.error || 'Login failed.' });
      }

    } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error(err);
        }
      }
  };

  render() {
    const { username, password, error } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <h3>Dreamalish</h3>
        <h4>Login</h4>

        <FormGroup>
          <Label>Username</Label>
          <Input
            value={username}
            onChange={(e) => this.setState({ username: e.target.value })}
            placeholder="Enter username"
          />
        </FormGroup>

        <FormGroup>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => this.setState({ password: e.target.value })}
            placeholder="Enter password"
          />
        </FormGroup>

        <Button type="submit">LOGIN</Button>

        {error && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </p>
        )}
      </Form>
    );
  }
}