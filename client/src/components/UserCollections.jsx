import {React, useEffect, useContext, useState} from "react";
import {useParams} from 'react-router-dom';
import {fetchAllUserCollections} from "../http/collectionAPI";
import {Container, Row, Button} from "react-bootstrap";
import {Context} from "../index";
import { observer } from "mobx-react";
import Collection from "./Collection";
import NewCollectionModal from "../modals/NewCollectionModal";

const UserCollections = observer(() => {

    const {id} = useParams();
    const {collection} = useContext(Context);

    const [modalVisisble, setModalVisible] = useState(false);

    useEffect(() => {
        fetchAllUserCollections(id).then(data => collection.setUserCollections(data));
    }, [id, modalVisisble]);

    return (
        <Container className="d-flex profile-container flex-column">
            <Button className="add-user-collection-btn" variant="outline-dark" onClick={() => setModalVisible(true)}>Create new collection</Button>
            <Row className="collections-wrapper">
                {collection.userCollections.map((collection) => 
                    <Collection key={collection.id} item={collection}/>
                )}
            </Row>
            <NewCollectionModal show={modalVisisble} onHide={() => setModalVisible(false)} userId={id}/>
        </Container>
    );
});

export default UserCollections;
