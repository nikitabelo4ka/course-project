import {React, useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {Container, Row} from "react-bootstrap";
import jwtDecode from 'jwt-decode';
import {fetchAllUserCollections} from "../http/collectionAPI";
import {Context} from "../index";
import {observer} from 'mobx-react';
import Collection from "./Collection";
import NewCollectionModal from "../modals/NewCollectionModal";
import '../styles/profile.css';

const Profile = observer(() => {

    const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem("token")) : null;

    const {collection} = useContext(Context);

    const [modalVisisble, setModalVisible] = useState(false);

    useEffect(() => {
        fetchAllUserCollections(token.id).then(data => collection.setUserCollections(data));
    }, [modalVisisble, token.id]);

    return (
        <Container className="d-flex profile-container">
            <h1 style={{textAlign: "center", marginTop: "60px"}}>{token.firstName}'s collections</h1>
            <Button className="btn btn-outline-dark add-collection-btn" onClick={() => setModalVisible(true)}>Create new collection</Button>
            <Row className="collections-wrapper">
                {collection.userCollections.map((collection) => 
                    <Collection key={collection.id} collection={collection}/>
                )}
            </Row>
            <NewCollectionModal show={modalVisisble} onHide={() => setModalVisible(false)}/>
        </Container>
    );
});

export default Profile;
