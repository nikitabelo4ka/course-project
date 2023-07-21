import {$authHost} from "./index";

export const createCollectionItem = async (name, tags, collectionId, customFields) => {
    const {data} = await $authHost.post('api/collectionItem', {name, tags, collectionId, customFields});
    return data;
};

export const fetchAllCollectionItems = async (collectionId) => {
    const {data} = await $authHost.get('api/collectionItem/all', {params: {collectionId}});
    return data;
};

export const deleteCollectionItem = async (id) => {
    const {data} = await $authHost.delete('api/collectionItem', {params: {id}});
    return data;
};

export const fetchLatestItems = async (limit) => {
    const {data} = await $authHost.get('api/collectionItem/latest', {params: {limit}});
    return data;
};

export const fetchOneCollectionItem = async (id) => {
    const {data} = await $authHost.get('api/collectionItem/one/' + id);
    return data;
};

export const modifyCollectionItem = async (collectionItemId, name, tags, customFields) => {
    const {data} = await $authHost.patch('api/collectionItem/modify', {name, tags, customFields}, {params: {collectionItemId}});
    return data;
};

export const fetchAllItems = async () => {
    const {data} = await $authHost.get('api/collectionItem/allItems');
    return data;
};
