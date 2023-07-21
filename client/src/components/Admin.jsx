import {React, useContext, useEffect} from "react";
import {fetchUsers, deleteUser, changeStatus, changeAdmin} from "../http/userAPI";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {observer} from 'mobx-react';
import {USER_COLLECTIONS_ROUTE} from "../utils/consts";
import jwtDecode from 'jwt-decode';
import '../styles/admin.css';

const Admin = observer(() => {

    const history = useNavigate();

    const {user} = useContext(Context);

    const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem("token")) : null;

    useEffect(() => {
        fetchUsers().then(data => user.setUsers(data));
    }, []);

    const Delete = (userId) => {
        if(token.id === userId) {
            user.setUser({});
            user.setIsAuth(false);
        }
        deleteUser(userId)
        .then(fetchUsers)
        .then(data => user.setUsers(data))
    };

    const checkStatusAndRole = (id, role) => {
        if(token.id === id && token.role === role) {
            user.setUser({});
            user.setIsAuth(false);
        } 
    };

    const ChangeStatus = (id, status) => {
        if(status === 'ACTIVE') {
            changeStatus(id, 'BLOCKED')
            .then(checkStatusAndRole(id))
            .then(fetchUsers)
            .then(data => user.setUsers(data))
        } else {
            changeStatus(id, 'ACTIVE')
            .then(fetchUsers)
            .then(data => user.setUsers(data))
        }
    };

    const ChangeAdmin = (id, role) => {
        if(role === 'ADMIN') {
            changeAdmin(id, 'USER')
            .then(checkStatusAndRole(id, role))
            .then(fetchUsers)
            .then(data => user.setUsers(data))
        } else {
            changeAdmin(id, 'ADMIN')
            .then(fetchUsers)
            .then(data => user.setUsers(data))
        }
    };

    return (
        <table className="table table-striped" style={{width: "70vw", border: "1px solid black", margin: "100px auto 0"}}>
            <thead className="thead-dark">
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Firstname</th>
                    <th scope="col">Email</th>
                    <th scope="col" style={{width: "8vw"}}>Status</th>
                    <th scope="col" style={{width: "8vw"}}>Role</th>
                    <th scope="col" style={{width: "8vw"}}></th>
                    <th scope="col" style={{width: "8vw"}}></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {user.users.map((item) => 
                    <tr key={item.id}>
                        <th scope="row">{item.id}</th>
                        <td>{item.firstName}</td>
                        <td>{item.email}</td>
                        <td>{item.status}</td>
                        <td>{item.role}</td>
                        <td><button onClick={() => ChangeStatus(item.id, item.status)}>{item.status === "ACTIVE" ? "Block user" : "Unblock user"}</button></td>
                        <td><button onClick={() => ChangeAdmin(item.id, item.role)} style={{marginLeft: "0.5vw", width: "6vw"}}>{item.role === "ADMIN" ? "Delete ADMIN" : "Set ADMIN"}</button></td>
                        <td><button onClick={() => Delete(item.id)}>Delete user</button></td>
                        <td><button onClick={() => history(USER_COLLECTIONS_ROUTE + '/' + item.id)}>Collections</button></td>
                    </tr>
                )}
            </tbody>
        </table>
    );
});

export default Admin;
