import { React, createContext } from 'react';
import ReactDom from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import CollectionStore from './store/CollectionStore';
import TagStore from './store/TagStore';
import CollectionItemsStore from './store/CollectionItemsStore';
import ThemeProvider from './themes/ThemeProvider';
import './index.scss';

export const Context = createContext(null);

const root = ReactDom.createRoot(document.getElementById('root'));

root.render(
  <Context.Provider
    value={{
      user: new UserStore(),
      collection: new CollectionStore(),
      tag: new TagStore(),
      collectionItems: new CollectionItemsStore(),
    }}
  >
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Context.Provider>,
);
