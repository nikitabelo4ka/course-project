import {React, useState} from "react";
import {useNavigate} from "react-router-dom";
import {COLLECTION_ROUTE} from "../utils/consts";
import {deleteCollection} from "../http/collectionAPI";
import { IKImage, IKContext } from 'imagekitio-react';
import NewCollectionModal from "../modals/NewCollectionModal";
import {observer} from 'mobx-react';
import jwtDecode from 'jwt-decode';

const Collection = observer(({collection}) => {

    const history = useNavigate();

    const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem("token")) : null;

    const [modalVisisble, setModalVisible] = useState(false);
    const [isModify, setIsModify] = useState(false);

    return (
        <div className="collection-item">
            <IKContext className="file-input" publicKey={process.env.REACT_APP_PUBLIC_KEY} urlEndpoint={process.env.REACT_APP_URL_ENDPOINT} authenticationEndpoint={process.env.REACT_APP_AUTHENTIFICATION_ENDPOINT} >
                <IKImage path={collection.images === "" ? "no_image.jpg" : collection.images} className="collection-item-image" alt="No image" onClick={() => history(COLLECTION_ROUTE + '/' + collection.id)}/>
            </IKContext>
            <div onClick={() => history(COLLECTION_ROUTE + '/' + collection.id)} className={token.role === "ADMIN" || token.id === collection.userId ? "collection-item-shadow" : "none"}></div>
            <p className="collection-item-name">{collection.name}</p>
            <div className={token.role === "ADMIN" || token.id === collection.userId ? "collection-item-shadow-buttons" : "none"}>
                <button className="collection-item-shadow-button" onClick={() => {setModalVisible(true); setIsModify(true)}}>Modify</button>
                <button className="collection-item-shadow-button" onClick={() => deleteCollection(collection.id)}>Delete</button>
            </div>
            <NewCollectionModal show={modalVisisble} onHide={() => setModalVisible(false)} info={collection} isModify={isModify}/>
        </div>
    );
});

export default Collection;
