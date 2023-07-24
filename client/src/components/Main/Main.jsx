import {React, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { fetchAllItems, fetchLatestItems } from "../../http/collectionItemAPI";
import { fetchOneCollection, fetchCollections } from "../../http/collectionAPI";
import Collection from "../Collection";
import {COLLECTION_ITEM_ROUTE} from "../../utils/consts";
import {Context} from "../../index";
import {observer} from 'mobx-react';
import {Container} from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import TagsCloud from "../TagsCloud";
import "./main.css";

const Main = observer(() => {

    const {collection} = useContext(Context);
    const history = useNavigate();

    const [resultCollections, setResultCollections] = useState([]);
    const [limit, setLimit] = useState(0);
    const [latestItems, setLatestItems] = useState([]);

    function groupBy(arr, property) {
        return arr.reduce((acc, cur) => {
          acc[cur[property]] = [...acc[cur[property]] || [], cur];
          return acc;
        }, {});
    };

    const getLatestItems = () => {
        fetchLatestItems(limit).then((data) => {
            setLatestItems(data);
        });
    };

    useEffect(() => {
        fetchAllItems().then((data) => {
            Object.entries(groupBy(data, "collectionId")).sort(function(a,b) {return b[1].length - a[1].length}).forEach((item, index) => {
                if (item[0] && index < 5) {
                    fetchOneCollection(item[0]).then((data) => {
                        setResultCollections((state) => ([...state, data]));
                    });
                }
            })
        });
        fetchCollections().then((data) => {
            collection.setCollections(data);
        });
    }, [collection]);

    return (
        <Container>
                <TagsCloud />
                <h1>All collections</h1>
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                    {collection.collections.map((item) => 
                        <Collection item={item} key={item.id}/>
                    )}
                </div>
                <div style={{marginBottom: "5vw"}}>
                    <div>
                        <h1>Latest items</h1>
                        <div className="d-flex align-items-center">
                            <input className="limit-input" value={limit} onChange={(e) => setLimit(e.target.value)} type="number"/>
                            <Button variant="warning" className="get-latest-items-btn" onClick={getLatestItems}>Get</Button>
                        </div>
                    </div>
                    {latestItems === [] ? <h1>Enter the desired number of items and click get</h1> :
                        <table className="table table-striped main-table">
                            <thead className="thead-dark main-table-head">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Collection</th>
                                    <th scope="col">Author</th>
                                </tr>
                            </thead>
                            <tbody className="thead-dark main-table-body">
                                {latestItems.map((item) => 
                                    <tr key={item.id} onClick={() => history(COLLECTION_ITEM_ROUTE + '/' + item.id)} style={{cursor: "pointer"}}>
                                        <th scope="row">{item.name}</th>
                                        <th scope="row">{item.collection.name}</th>
                                        <th scope="row">{item.collection.user.firstName}</th> 
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    }
                </div>
                <h1>Five biggest collections</h1>
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                    {resultCollections.map((item) => 
                        <Collection item={item} key={item.id}/>
                    )}
                </div>
        </Container>
    );
});

export default Main;
