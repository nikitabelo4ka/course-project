import { React, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { COLLECTION_ROUTE } from '../utils/consts';
import { deleteCollection, fetchCollections } from '../http/collectionAPI';
import { IKImage, IKContext } from 'imagekitio-react';
import NewCollectionModal from '../modals/NewCollectionModal';
import { Context } from '../index';
import jwtDecode from 'jwt-decode';

const Collection = observer(({ item }) => {
  const history = useNavigate();
  const { collection } = useContext(Context);

  const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null;

  const [modalVisisble, setModalVisible] = useState(false);
  const [isModify, setIsModify] = useState(false);

  const deleteCol = () => {
    deleteCollection(item.id);
    fetchCollections().then((data) => {
      collection.setCollections(data);
    });
  };

  return (
    <div className="collection-item">
      <IKContext
        className="file-input"
        publicKey={process.env.REACT_APP_PUBLIC_KEY}
        urlEndpoint={process.env.REACT_APP_URL_ENDPOINT}
        authenticationEndpoint={process.env.REACT_APP_AUTHENTIFICATION_ENDPOINT}
      >
        <IKImage
          path={item.images === '' ? 'no_image.jpg' : item.images}
          className="collection-item-image"
          alt="No image"
          onClick={() => history(COLLECTION_ROUTE + '/' + item.id)}
        />
      </IKContext>
      <div
        onClick={() => history(COLLECTION_ROUTE + '/' + item.id)}
        className={token && (token.role === 'ADMIN' || token.id === item.userId) ? 'collection-item-shadow' : 'd-none'}
      ></div>
      <p className="collection-item-name">{item.name}</p>
      <div
        className={
          token && (token.role === 'ADMIN' || token.id === item.userId) ? 'collection-item-shadow-buttons' : 'd-none'
        }
      >
        <button
          className="collection-item-shadow-button"
          onClick={() => {
            setModalVisible(true);
            setIsModify(true);
          }}
        >
          Modify
        </button>
        <button className="collection-item-shadow-button" onClick={deleteCol}>
          Delete
        </button>
      </div>
      <NewCollectionModal show={modalVisisble} onHide={() => setModalVisible(false)} info={item} isModify={isModify} />
    </div>
  );
});

export default Collection;
