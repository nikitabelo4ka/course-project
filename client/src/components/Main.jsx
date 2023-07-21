import {React, useContext, useEffect, useState} from "react";
import { fetchTags } from "../http/tagsAPI";
import { fetchAllItems, fetchLatestItems } from "../http/collectionItemAPI";
import { fetchOneCollection, fetchCollections } from "../http/collectionAPI";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {observer} from 'mobx-react';
import {Container} from "react-bootstrap";
import Collection from "./Collection";
import {COLLECTION_ITEM_ROUTE} from "../utils/consts";
import "../styles/main.css";

const Main = observer(() => {

    const {tag} = useContext(Context);
    const history = useNavigate();

    const [resultCollections, setResultCollections] = useState([]);
    const [collections, setCollections] = useState([]);
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
        })
    };

    useEffect(() => {
        fetchTags().then((data) => tag.setTags(data));
        fetchAllItems().then((data) => {
            Object.entries(groupBy(data, "collectionId")).sort(function(a,b) {return b[1].length - a[1].length}).forEach((item, index) => {
                if (index < 5) {
                    fetchOneCollection(item[0]).then((data) => {
                        setResultCollections((state) => ([...state, data]));
                    });
                }
            })
        });
        fetchCollections().then((data) => {
            setCollections(data);
        });

    }, [tag]);

    console.log(resultCollections)

    return (
        <Container>
                <h1 style={{textAlign: "center", marginTop: "2vw"}}>#Tags</h1>
                {tag.tags.map((item) =>
                    <p key={item.id} className="tag">{item.text}</p>
                )}
                <h1 style={{textAlign: "center", marginTop: "2vw"}}>All collections</h1>
                <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                    {collections.map((item) => 
                        <Collection collection={item} key={item.id}/>
                    )}
                </div>
                <div style={{marginBottom: "5vw"}}>
                    <div>
                        <h1 style={{textAlign: "center", marginTop: "2vw"}}>Latest items</h1>
                        <input className="limit-input" value={limit} onChange={(e) => setLimit(e.target.value)} type="number"/>
                        <button type="button" className="btn btn-warning get-latest-items-btn" onClick={getLatestItems}>Get</button>
                    </div>
                    {latestItems === [] ? <h3 style={{textAlign: "center", marginTop: "2vw"}}>Enter the desired number of items and click get</h3> :
                        <table className="table table-striped" style={{border: "1px solid black", margin: "100px auto 0"}}>
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Collection</th>
                                    <th scope="col">Author</th>
                                </tr>
                            </thead>
                            <tbody>
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
                <h1 style={{textAlign: "center", marginTop: "2vw"}}>Five biggest collections</h1>
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {resultCollections.map((item) => 
                        <Collection collection={item} key={item.id}/>
                    )}
                </div>
        </Container>
    );
});

export default Main;
