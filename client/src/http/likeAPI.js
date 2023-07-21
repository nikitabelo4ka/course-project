import {$authHost} from "./index";

export const createLike = async (userId, itemId) => {
    const {data} = await $authHost.post('api/like', {userId, itemId});
    return data;
};

export const deleteLike = async (userId, itemId) => {
    const {data} = await $authHost.delete('api/like/userLikes/delete', {params: {userId, itemId}});
    return data;
};

export const fetchAllUserLikes = async (userId) => {
    const {data} = await $authHost.get('api/like/userLikes/' + userId);
    return data;
};

export const fetchAllItemLikes = async (itemId) => {
    const {data} = await $authHost.get('api/like/itemLikes/' + itemId);
    return data;
};
