import {React, useState, useEffect, useContext} from "react";
import Button from "react-bootstrap/Button";
import {useParams, useNavigate} from 'react-router-dom';
import {fetchOneCollection} from "../http/collectionAPI";
import {fetchAllCollectionItems, deleteCollectionItem} from "../http/collectionItemAPI";
import {Col, Container, Row} from "react-bootstrap";
import { IKImage, IKContext } from 'imagekitio-react';
import {COLLECTION_ITEM_ROUTE} from "../utils/consts";
import {observer} from 'mobx-react';
import NewCollectionItemModal from "../modals/NewCollectionItemModal";
import { MaterialReactTable } from 'material-react-table';
import {Context} from "../index";
import jwtDecode from 'jwt-decode';
import "../styles/collectionPage.css";

const CollectionPage = observer(() => {

    const history = useNavigate();

    const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem("token")) : null;

    const {id} = useParams();
    const {collectionItems} = useContext(Context);

    const [item, setItem] = useState({});
    const [modalVisisble, setModalVisible] = useState(false);
    const [isModify, setIsModify] = useState(false);
    const [collectionItemId, setCollectionItemId] = useState(0);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        fetchOneCollection(id).then(data => {
            setItem(data);
            let collectionEntries = Object.entries(data);
            const customFieldsKeys = [];
            collectionEntries.map((item) => {
                if(item[0] === 'integerField1' || item[0] === 'textField1' || item[0] === 'dateField1') {
                    customFieldsKeys.push(item);
                }
            })
            const cols = [['name', 'Name'], ...customFieldsKeys].map(([key, value]) => ({
                header: value === null ? "(The field value is not set)" : value,
                accessorKey: key,
                filterVariant: key.includes('integer') ? 'range' : 'text',
                Cell: ({ cell }) => key.includes('text') ? (cell.getValue() === null ? 'Value is not completed :(' : cell.getValue()) : (key.includes('date') ? (cell.getValue() === null || undefined ? "Value is not completed :(" : cell.getValue().slice(0,10)) : cell.getValue()),
            }));
            setColumns(cols);
        }).then(() => {
            fetchAllCollectionItems(id).then(data => collectionItems.setCollectionItems(data));
        })
    }, [id, isModify, modalVisisble]);

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <IKContext publicKey={process.env.REACT_APP_PUBLIC_KEY} urlEndpoint={process.env.REACT_APP_URL_ENDPOINT} authenticationEndpoint={process.env.REACT_APP_AUTHENTIFICATION_ENDPOINT} >
                        <IKImage path={item.images === "" ? "no_image.jpg" : item.images} className="collection-page-image" alt="No image"/>
                    </IKContext>
                </Col>
                <Col className="collection-page-info-wrapper">
                    <h1 className="collection-page-info-text bold">{item.name}</h1>
                    <h2 className="collection-page-info-text">Theme: {item.theme}</h2>
                    <h2 className="collection-page-info-text">Description: {item.description}</h2>
                    <h2 className="collection-page-info-text">Number of items: {collectionItems.collectionItems.length}</h2>
                    <Button className={token === null || token.id !== item.userId ? (token.role === "ADMIN" ? "btn btn-outline-dark add-collection-item-btn" : "none") : "btn btn-outline-dark add-collection-item-btn"} onClick={() => {setModalVisible(true); setCollectionItemId(0)}}>Create new collection item</Button>
                </Col>
                <MaterialReactTable
                    enableRowActions
                    columns={columns}
                    data={collectionItems.collectionItems}
                    initialState={{ showColumnFilters: true }}
                    renderRowActionMenuItems={({ row }) => [
                        <div className={token === null || token.id !== item.userId ? (token.role === "ADMIN" ? "table-action-button" : "none") : "table-action-button"} key="edit" onClick={() => {setModalVisible(true); setIsModify(true); setCollectionItemId(collectionItems.collectionItems[row.index].id)}}>
                            Edit
                        </div>,
                        <div className={token === null || token.id !== item.userId ? (token.role === "ADMIN" ? "table-action-button" : "none") : "table-action-button"} key="delete" onClick={() => deleteCollectionItem(collectionItems.collectionItems[row.index].id)}>
                            Delete
                        </div>,
                         <div className="table-action-button" key="view" onClick={() => history(COLLECTION_ITEM_ROUTE + '/' + collectionItems.collectionItems[row.index].id)}>
                            View item
                        </div>
                      ]}
                />
            </Row>
            <NewCollectionItemModal show={modalVisisble} onHide={() => {setModalVisible(false); setIsModify(false)}} collectionId={id} collectionItemId={collectionItemId} isModify={isModify}/>
        </Container>
    );
});

export default CollectionPage;
