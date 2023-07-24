import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import { LOGIN_ROUTE, MAIN_ROUTE, ADMIN_ROUTE, PROFILE_ROUTE } from '../../utils/consts';
import ThemeSelector from '../ThemeSelector';
import { ThemeContext, themes } from '../../themes/ThemeContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Button, Container } from 'react-bootstrap';
import jwtDecode from 'jwt-decode';
import './navBar.css';

const NavBar = observer(() => {
  const history = useNavigate();

  const { user } = useContext(Context);

  const [isUser, setIsUser] = useState(true);

  const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null;

  useEffect(() => {
    if (token && token.role === 'USER') {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, [token]);

  const logOut = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem('token');
    history(MAIN_ROUTE);
  };

  return (
    <Navbar className="navbar">
      <Container>
        <div
          style={{
            flexWrap: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <NavLink style={{ color: 'white' }} to={MAIN_ROUTE} className="main-link">
            Main
          </NavLink>
          <ThemeContext.Consumer>
            {({ theme, setTheme }) => (
              <ThemeSelector
                onChange={() => {
                  if (theme === themes.light) setTheme(themes.dark);
                  if (theme === themes.dark) setTheme(themes.light);
                }}
                value={theme === themes.dark}
              />
            )}
          </ThemeContext.Consumer>
          {user.isAuth ? (
            <Nav>
              <Button className="navbar-btn" variant={'outline-dark'} onClick={() => logOut()}>
                Log out
              </Button>
              <Button
                className={isUser === true ? 'd-none' : 'navbar-btn'}
                variant={'outline-dark'}
                onClick={() => history(ADMIN_ROUTE)}
              >
                Admin
              </Button>
              <Button className="navbar-btn" variant={'outline-dark'} onClick={() => history(PROFILE_ROUTE)}>
                Profile
              </Button>
            </Nav>
          ) : (
            <Nav>
              <Button className="navbar-btn" variant={'outline-dark'} onClick={() => history(LOGIN_ROUTE)}>
                Authorization
              </Button>
            </Nav>
          )}
        </div>
      </Container>
    </Navbar>
  );
});

export default NavBar;
