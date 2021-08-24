import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

export class Login extends Component {
  state={
    email: '',
    password: ''
  }
  handeChange = (name, value) => {
    this.setState({
      [`${name}`]: value
    })
  }
  render() {
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src={require("../../assets/images/logo-dark.svg")} alt="logo" />
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                <Form className="pt-3">
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="email" placeholder="Username" size="lg" className="h-auto" onChange={(event) => {
                      this.handeChange('email', event.target.value)
                    }}  />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="password" placeholder="Password" size="lg" className="h-auto"  onChange={(event) => {
                      this.handeChange('password', event.target.value)
                    }}/>
                  </Form.Group>
                  <div className="mt-3">
                    <Button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={() => this.props.handleLogin(this.state.email, this.state.password)}>SIGN IN</Button>
                  </div>

                </Form>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
  }
}

export default Login
