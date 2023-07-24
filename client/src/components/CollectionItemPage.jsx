import {React, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { fetchOneCollectionItem } from "../http/collectionItemAPI";
import { fetchOneCollection } from "../http/collectionAPI";
import { fetchAllItemTags } from "../http/tagsAPI";
import { createLike, fetchAllUserLikes, deleteLike, fetchAllItemLikes } from "../http/likeAPI";
import { createComment, fetchItemComments, deleteComment } from "../http/commentsAPI";
import {observer} from 'mobx-react';
import parseISO from "date-fns/parseISO";
import formatDistance from "date-fns/formatDistance";
import io from "socket.io-client";
import {Form, Button, Container} from "react-bootstrap";
import jwtDecode from 'jwt-decode';

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
            token && fetchAllUserLikes(token.id).then((likes) => {
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

    const sendComment = (e) => {
        e.preventDefault();
        createComment(token.id, token.firstName, collectionItemInfo.id, commentValue);
        setCommentValue('');
    };

    return (
        <Container>
            <div className="d-flex info-wrapper">
                <div className="d-flex">
                    <div className="collection-item-page-column">
                        {customFieldsKeys.map((item) => (
                            <p key={item[1]} className="collection-page-info-item bold">{item[1]}:</p>
                        ))}
                    </div>
                    <div className="collection-item-page-column values">
                        {customFieldsValues.map((item, index) => (
                            <p key={index} className="collection-page-info-item">{item === null ? "-" : (typeof item === "boolean" ? (item === true ? "Yes" : "No") : (new Date(item) !== "Invalid Date" && !isNaN(new Date(item)) && typeof item !== 'number' ? new Date(item).toLocaleDateString() : item))}</p>
                        ))}
                    </div>
                </div>
                <div className="description">
                    <p className="collection-page-info-item bold">{collectionItemInfo.name}</p>
                    <p className="collection-page-info-item bold">{collectionInfo.name}</p>
                    <p className="collection-page-info-item bold">Theme: {collectionInfo.theme}</p>
                    <p className="collection-page-info-item bold">{collectionInfo.description}</p>
                </div>
                <div>
                    <div className="d-flex">
                        {tags.map((tag) =>
                            <p key={tag.id} className="collection-item-tag">#{tag[0].text}</p>
                        )}
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        <svg className={token ? (isItemLiked ? "like" : "dislike") : "d-none"} onClick={() => token && checkLike(token.id, collectionItemInfo.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="42" height="36"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg>
                        <p className="item-likes">{itemLikes} likes</p>
                    </div>
                </div>
            </div>
            <div style={{margin: "3vw 0 3vw 0"}}>
                <h1 style={{textAlign: "center", fontSize: "2vw"}}>Comments</h1>
                <div className="comments-wrapper">
                    {itemComments.map((comment) => 
                        <div className="comment" key={comment.id}>
                            <div className="comment-wrapper">
                                <span className="comment-author">
                                    {comment.userName}
                                </span>
                                <span className="comment-text">{comment.text}</span>
                            </div>
                            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <p className="comment-time">{formatDate(comment.createdAt)}</p>
                                <div onClick={() => deleteComment(comment.id)} className={token && (comment.userName === token.firstName || token.role === "ADMIN") ? "delete-comment-button" : "d-none"}>+</div>
                            </div>
                        </div>
                    )}
                    <Form className={token ? "comment-send-wrapper" : "d-none"} onSubmit={sendComment}>
                        <input type="text" className="comment-input" value={commentValue} onChange={(e) => setCommentValue(e.target.value)} placeholder="Comment..." required/>
                        <Button variant="success" type="submit" className="comment-send-button">Send</Button>
                    </Form>
                </div>
            </div>
        </Container>    
    );
});

export default CollectionItemPage;