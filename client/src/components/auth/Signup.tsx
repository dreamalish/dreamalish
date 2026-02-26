import React, { FormEvent } from 'react';
import { Form, FormGroup, Label, Button, Input, Row, Col } from 'reactstrap';
import APIURL from '../../helper/Environment';
import DefaultProfilePic from '../../assets/defaultProfilePic.jpg';


type Props = {
  updateToken: (newToken: string) => void;
};

type State = {
  username: string;
  email: string;
  password: string;
  profilePic: string;
  nsfwOk: boolean;
  error: string;
};


export default class Signup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      profilePic: DefaultProfilePic,
      nsfwOk: false,
      error: ''
    };
  }

  handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { username, email, password, profilePic, nsfwOk } = this.state;

    if (!username || !email || !password) {
      this.setState({ error: 'All fields are required.' });
      return;
    }

    try {
      const response = await fetch(`${APIURL}/api/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
          profilePic,
          nsfwOk
        })
      });

      // If server returned HTML (like a crash page), catch it
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();

      if (data.sessionToken) {
        localStorage.setItem('token', data.sessionToken);
        this.props.updateToken(data.sessionToken);
      } else {
        this.setState({ error: data.error || 'Signup failed.' });
      }

    } catch (err) {
      console.error('Signup error:', err);
      this.setState({ error: 'Signup request failed. Check backend.' });
    }
  };

  render() {
    const { username, email, password, profilePic, nsfwOk, error } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <h3>Dreamalish</h3>
        <h4>Register</h4>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => this.setState({ username: e.target.value })}
                placeholder="Choose username"
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                placeholder="Enter email"
              />
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                placeholder="Create password"
              />
            </FormGroup>

            <FormGroup>
              <Label>Profile Picture (URL)</Label>
              <Input
                type="text"
                value={profilePic}
                onChange={(e) => this.setState({ profilePic: e.target.value })}
                placeholder="Image URL"
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
          </Col>
        </Row>

        <Button type="submit" style={{ marginTop: '10px' }}>
          SIGN UP
        </Button>

        {error && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </p>
        )}
      </Form>
    );
  }
}