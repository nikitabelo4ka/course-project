import {React, useEffect, useState} from "react";
import { fetchOneCollectionItem } from "../http/collectionItemAPI";
import { fetchOneCollection } from "../http/collectionAPI";
import { fetchAllItemTags } from "../http/tagsAPI";
import { createLike, fetchAllUserLikes, deleteLike, fetchAllItemLikes } from "../http/likeAPI";
import { createComment, fetchItemComments, deleteComment } from "../http/commentsAPI";
import { useParams } from "react-router-dom";
import {Container} from "react-bootstrap";
import io from "socket.io-client";
import {observer} from 'mobx-react';
import jwtDecode from 'jwt-decode';
import parseISO from "date-fns/parseISO";
import formatDistance from "date-fns/formatDistance";

const socket = io.connect(process.env.REACT_APP_API_URL);

const CollectionItemPage = observer(() => {

    const {id} = useParams();

    const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem("token")) : null;

    const [collectionItemInfo, setCollectionItemInfo] = useState({});
    const [collectionInfo, setCollectionInfo] = useState({});
    const [isItemLiked, setIsItemLiked] = useState(false);
    const [itemLikes, setItemLikes] = useState(0);
    const [customFieldsKeys, setCustomFieldsKeys] = useState([]);
    const [customFieldsValues, setCustomFieldsValues] = useState([]);
    const [commentValue, setCommentValue] = useState('');
    const [itemComments, setItemComments] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetchItemComments(id).then((data) => {
            setItemComments(data);
        });
    }, [id]);

    useEffect(() => {
        fetchOneCollectionItem(id).then((data) => {
            setCollectionItemInfo(data);
            fetchOneCollection(data.collectionId).then((collection) => {
                setCustomFieldsKeys([]);
                setCustomFieldsValues([]);
                setCollectionInfo(collection);
                let collectionEntries = Object.entries(collection);
                const customFields = collectionEntries.filter(([key, value]) => value !== null && key.includes("Field"));
                setCustomFieldsKeys(customFields);
                customFields.map(([key, value]) => setCustomFieldsValues((state) => [...state, data[key]]));
            });
            fetchAllUserLikes(token.id).then((likes) => {
                likes.map((like) => {
                    if(like.itemId === data.id) {
                        setIsItemLiked(true);
                    };
                })
            });
            fetchAllItemLikes(id).then((data) => {
                setItemLikes(data.length);
            });
            fetchAllItemTags(id).then((data) => {
                setTags(data);
            })
        });
    }, [id, isItemLiked]);

    useEffect(() => {
        socket.on("new-comment", ({ comment }) => {
            setItemComments((comments) => [...comments, comment]);
        });

        socket.on('delete-comment', ({ id }) => {
            setItemComments((comments) => comments.filter((comment) => comment.id != id));
        });
      
        return () => {
          socket.off("new-comment");
        };
    }, [setItemComments, socket]);

    const checkLike = (userId, itemId) => {
        fetchAllUserLikes(userId).then((data) => {
            const likes = data.filter((like) => like.itemId === itemId);
            if (likes.length > 0) {
                deleteLike(userId, itemId);
                setIsItemLiked(false);
            } else {
                createLike(userId, itemId);
                setIsItemLiked(true);
            }
        });
    };

    const formatDate = (dateStr) => {
        const date = parseISO(dateStr);
        return formatDistance(date, new Date(), { addSuffix: true });
    };

    const sendComment = () => {
        createComment(token.id, token.firstName, collectionItemInfo.id, commentValue);
        setCommentValue('');
    };

    return (
        <>
            <Container className="d-flex info-wrapper">
                <div className="collection-item-page-column">
                    {customFieldsKeys.map((item) => 
                        <p key={item[1]} className="collection-page-info-item bold">{item[1]}</p>
                    )}
                </div>
                <div className="collection-item-page-column values">
                    {customFieldsValues.map((item) =>
                        <p key={item[0]} className="collection-page-info-item">{typeof item === "boolean" ? (item === true ? "Yes" : "No") : (new Date(item) !== "Invalid Date" && !isNaN(new Date(item)) && typeof item !== 'number' ? new Date(item).toLocaleDateString() : item)}</p>
                    )}
                </div>
                <div className="description">
                    <p className="collection-page-info-item bold">{collectionItemInfo.name}</p>
                    <p className="collection-page-info-item bold">{collectionInfo.name}</p>
                    <p className="collection-page-info-item bold">Theme: {collectionInfo.theme}</p>
                    <p className="collection-page-info-item bold">{collectionInfo.description}</p>
                    <div className="d-flex">
                        {tags.map((tag) =>
                            <p key={tag.id} style={{fontSize: "1vw"}}>#{tag[0].text}</p>
                        )}
                    </div>
                    <div className="d-flex">
                        <svg className={isItemLiked ? "like" : "dislike"} onClick={() => checkLike(token.id, collectionItemInfo.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="42" height="36"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg>
                        <p className="item-likes">{itemLikes} likes</p>
                    </div>
                </div>
            </Container>
            <Container style={{marginTop: "3vw"}}>
                <h1 style={{textAlign: "center"}}>Comments</h1>
                <div className="comments-wrapper">
                    {itemComments.map((comment) => 
                        <div className="comment" key={comment.id}>
                            <div className="comment-wrapper">
                                <span className="comment-author">
                                    {comment.userName}
                                </span>
                                <span className="comment-text">{comment.text}</span>
                            </div>
                            <div style={{display: "flex"}}>
                                <p className="comment-time">{formatDate(comment.createdAt)}</p>
                                <div onClick={() => deleteComment(comment.id)} className={comment.userName === token.firstName || token.role === "ADMIN" ? "delete-comment-button" : "none"}>+</div>
                            </div>
                        </div>
                    )}
                    <div>
                        <input type="text" className="comment-input" value={commentValue} onChange={(e) => setCommentValue(e.target.value)} placeholder="Comment..."/>
                        <button type="button" className="btn btn-outline-success comment-send-button" onClick={sendComment}>Send</button>
                    </div>
                </div>
            </Container>
        </>    
    );
});

export default CollectionItemPage;