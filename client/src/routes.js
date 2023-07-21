import {ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, MAIN_ROUTE, PROFILE_ROUTE, COLLECTION_ROUTE, USER_COLLECTIONS_ROUTE, COLLECTION_ITEM_ROUTE} from "./utils/consts";
import Auth from "./components/Auth";
import Admin from "./components/Admin";
import Main from "./components/Main";
import Profile from "./components/Profile";
import CollectionPage from "./components/CollectionPage";
import UserCollections from "./components/UserCollections";
import CollectionItemPage from "./components/CollectionItemPage";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: USER_COLLECTIONS_ROUTE + '/:id',
        Component: UserCollections
    },
];

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: MAIN_ROUTE,
        Component: Main
    },
    {
        path: COLLECTION_ROUTE + '/:id',
        Component: CollectionPage
    },
    {
        path: COLLECTION_ITEM_ROUTE + '/:id',
        Component: CollectionItemPage
    },
];
