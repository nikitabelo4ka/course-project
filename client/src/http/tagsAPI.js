import {$authHost} from "./index";

export const fetchTags = async () => {
    const {data} = await $authHost.get('api/tags');
    return data;
};

export const fetchAllItemTags = async (itemId) => {
    const {data} = await $authHost.get('api/tags/itemTags/' + itemId);
    return data;
};
