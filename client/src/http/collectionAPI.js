import {$authHost} from "./index";

export const createCollection = async (name, theme, images, description, customFields, userId) => {
    const {data} = await $authHost.post('api/collection', {name, theme, images, description, customFields, userId});
    return data;
};

export const fetchCollections = async () => {
    const {data} = await $authHost.get('api/collection');
    return data;
};

export const fetchOneCollection = async (id) => {
    const {data} = await $authHost.get('api/collection/one/' + id);
    return data;
};

export const fetchAllUserCollections = async (userId) => {
    const {data} = await $authHost.get('api/collection/user/' + userId);
    return data;
};

export const deleteCollection = async (id) => {
    const {data} = await $authHost.delete('api/collection', {params: {id}});
    return data;
};

export const modifyCollection = async (id, name, theme, images, description, customFields) => {
    const {data} = await $authHost.patch('api/collection', {name, theme, images: images, description, customFields}, {params: {id}});
    return data;
};
