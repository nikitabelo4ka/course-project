import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {NavLink} from "react-router-dom";
import {LOGIN_ROUTE, MAIN_ROUTE, ADMIN_ROUTE, PROFILE_ROUTE} from "../utils/consts";
import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import ThemeSelector from './ThemeSelector';
import { ThemeContext, themes } from '../themes/ThemeContext';
import jwtDecode from 'jwt-decode';
import "../styles/navBar.css";

const NavBar = observer(() => {

    const history = useNavigate();

    const {user} = useContext(Context);

    const [isUser, setIsUser] = useState(true);

    const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem("token")) : null;

    useEffect(() => {

        if(token && token.role === "USER") {
            setIsUser(true);
        } else {
            setIsUser(false);
        }

    }, [token]);

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
    };

    return (
        <Navbar className="navbar">
            <div style={{flexWrap: "nowrap", display: "flex"}}>
                <NavLink style={{color:'white', fontSize: "30px", marginLeft: "12.5vw", marginTop: "0px", textDecoration: "none"}} to={MAIN_ROUTE}>Main</NavLink>
                <ThemeContext.Consumer>
                    {({ theme, setTheme }) => (
                    <ThemeSelector
                        onChange={() => {
                        if (theme === themes.light) setTheme(themes.dark)
                        if (theme === themes.dark) setTheme(themes.light)
                        }}
                        value={theme === themes.dark}
                    />
                    )}
                </ThemeContext.Consumer>
                {user.isAuth ?
                    <Nav style={{color: 'black', fontSize: "20px", marginLeft: "51vw"}}>
                        <Button style={{fontSize: "20px", color: 'white'}} variant={"outline-dark"} onClick={() => logOut()} className="ml-2">
                            Log out
                        </Button>
                        <Button className={isUser === true ? "d-none" : "admin"} style={{fontSize: "20px", color: 'white', marginLeft: "1vw"}} variant={"outline-dark"} onClick={() => history(ADMIN_ROUTE)}>
                            Admin
                        </Button>
                        <Button className="ml-2" style={{fontSize: "20px", color: 'white', marginLeft: "1vw"}} variant={"outline-dark"} onClick={() => history(PROFILE_ROUTE)}>
                            Profile
                        </Button>
                    </Nav>
                    :
                    <Nav style={{color: 'white'}}>
                        <Button style={{fontSize: "20px", color: 'white', marginLeft: "55vw"}} variant={"outline-dark"} onClick={() => history(LOGIN_ROUTE)}>Authorization</Button>
                    </Nav>
                }
            </div>
        </Navbar>
    );
});

export default NavBar;
