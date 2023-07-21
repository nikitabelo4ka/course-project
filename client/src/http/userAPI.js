import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (email, password, firstName) => {
    const {data} = await $host.post('api/user/registration', {email, password, firstName});
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
};

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password});
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
};

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth' );
    localStorage.setItem('token', data.token);
    return jwt_decode(data.token);
};

export const fetchUsers = async () => {
    const {data} = await $authHost.get('api/user');
    return data;
};

export const deleteUser = async (id) => {
    const {data} = await $authHost.delete('api/user', {params: {id}});
    return data;
};

export const changeStatus = async (id, status) => {
    const {data} = await $authHost.patch('api/user/status', {status}, {params: {id}});
    return data;
};

export const changeAdmin = async (id, role) => {
    const {data} = await $authHost.patch('api/user/role', {role}, {params: {id}});
    return data;
};
