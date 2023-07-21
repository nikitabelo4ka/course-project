import {$authHost} from "./index";

export const createComment = async (userId, userName, itemId, text) => {
    const {data} = await $authHost.post('api/comments/create', {userId, userName, itemId, text});
    return data;
};

export const fetchItemComments = async (itemId) => {
    const {data} = await $authHost.get('api/comments/itemComments', {params: {itemId}});
    return data;
};

export const deleteComment = async (id) => {
    const {data} = await $authHost.delete('api/comments/itemComments/delete/' + id);
    return data;
};
