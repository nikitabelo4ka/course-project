import React, { useContext, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MAIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';
import { login, registration } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { Container, Form } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

const Auth = observer(() => {
  const location = useLocation();

  const isLogin = location.pathname === LOGIN_ROUTE;

  const { user } = useContext(Context);
  const history = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');

  const click = async () => {
    try {
      let data;

      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await registration(email, password, firstName);
      }

      user.setUser(user);
      user.setIsAuth(true);
      history(MAIN_ROUTE);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: window.innerHeight - 54 }}>
      <Card style={{ width: 600 }} className="p-5 auth-form">
        <h2 className="m-auto">{isLogin ? 'Authorization' : 'Registration'}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className={isLogin ? 'd-none' : 'mt-3'}
            placeholder="Firstname..."
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin ? (
              <p>
                No account ? <NavLink to={REGISTRATION_ROUTE}>Sign up !</NavLink>
              </p>
            ) : (
              <p>
                Have an account ?<NavLink to={LOGIN_ROUTE}> Sign in !</NavLink>
              </p>
            )}
            <Button variant={'outline-success'} onClick={click} style={{ marginTop: '1vw' }}>
              {isLogin ? 'Login' : 'Registration'}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
