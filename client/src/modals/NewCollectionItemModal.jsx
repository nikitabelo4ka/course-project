import {React, useContext, useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {Form, Button} from "react-bootstrap";
import { fetchOneCollection } from "../http/collectionAPI";
import { createCollectionItem, fetchOneCollectionItem, modifyCollectionItem } from "../http/collectionItemAPI";
import { fetchAllItemTags } from "../http/tagsAPI";
import {Context} from "../index";
import { TagsInput } from "react-tag-input-component";

const NewCollectionItemModal = ({show, onHide, collectionId, isModify, collectionItemId}) => {

    const {collection} = useContext(Context);

    const [name, setName] = useState('');
    const [tags, setTags] = useState([]);
    const [integerNames, setIntegerNames] = useState([]);
    const [textNames, setTextNames] = useState([]);
    const [stringNames, setStringNames] = useState([]);
    const [dateNames, setDateNames] = useState([]);
    const [boolNames, setBoolNames] = useState([]);

    const [customFieldsValue, setCustomFieldsValue] = useState({
        integer: {
            integerField1: '',
            integerField2: '',
            integerField3: ''
        },
        text: {
            textField1: '',
            textField2: '',
            textField3: ''
        },
        string: {
            stringField1: '',
            stringField2: '',
            stringField3: ''
        },
        date: {
            dateField1: '',
            dateField2: '',
            dateField3: ''
        },
        bool: {
            boolField1: false,
            boolField2: false,
            boolField3: false
        }
    });

    const closeModal = () => {
        setCustomFieldsValue((state) => ({...state, integer: {...state.integer, integerField1: ''}}));
        setCustomFieldsValue((state) => ({...state, integer: {...state.integer, integerField2: ''}}));
        setCustomFieldsValue((state) => ({...state, integer: {...state.integer, integerField3: ''}}));
        setCustomFieldsValue((state) => ({...state, text: {...state.text, textField1: ''}}));
        setCustomFieldsValue((state) => ({...state, text: {...state.text, textField2: ''}}));
        setCustomFieldsValue((state) => ({...state, text: {...state.text, textField3: ''}}));
        setCustomFieldsValue((state) => ({...state, string: {...state.string, stringField1: ''}}));
        setCustomFieldsValue((state) => ({...state, string: {...state.string, stringField2: ''}}));
        setCustomFieldsValue((state) => ({...state, string: {...state.string, stringField3: ''}}));
        setCustomFieldsValue((state) => ({...state, date: {...state.date, dateField1: ''}}));
        setCustomFieldsValue((state) => ({...state, date: {...state.date, dateField2: ''}}));
        setCustomFieldsValue((state) => ({...state, date: {...state.date, dateField3: ''}}));
        setCustomFieldsValue((state) => ({...state, bool: {...state.bool, boolField1: ''}}));
        setCustomFieldsValue((state) => ({...state, bool: {...state.bool, boolField2: ''}}));
        setCustomFieldsValue((state) => ({...state, bool: {...state.bool, boolField3: ''}}));
        setName('');
        setTags([]);
        onHide();
    };

    const addCollection = () => {
        if(isModify) {
            modifyCollectionItem(collectionItemId, name, JSON.stringify(tags), JSON.stringify([...Object.values(customFieldsValue.integer), ...Object.values(customFieldsValue.text), ...Object.values(customFieldsValue.string), ...Object.values(customFieldsValue.date), ...Object.values(customFieldsValue.bool)])).then((data) => {
                onHide();
            })
        } else {
            createCollectionItem(name, JSON.stringify(tags), collectionId, JSON.stringify([...Object.values(customFieldsValue.integer), ...Object.values(customFieldsValue.text), ...Object.values(customFieldsValue.string), ...Object.values(customFieldsValue.date), ...Object.values(customFieldsValue.bool)])).then((data) => {
                closeModal();
            });
        }
    };

    useEffect(() => {
        fetchOneCollection(collectionId).then((data) => {
            const collectionEntries = Object.entries(data);
            const customFields = collectionEntries.filter(([key, value]) => value !== null && key.includes("Field"));
            const customFieldsInteger = customFields.filter(([key, value]) => key.includes('integer'));
            const customFieldsText = customFields.filter(([key, value]) => key.includes('text'));
            const customFieldsString = customFields.filter(([key, value]) => key.includes('string'));
            const customFieldsDate = customFields.filter(([key, value]) => key.includes('date'));
            const customFieldsBool = customFields.filter(([key, value]) => key.includes('bool'));
            setIntegerNames(customFieldsInteger);
            setTextNames(customFieldsText);
            setStringNames(customFieldsString);
            setDateNames(customFieldsDate);
            setBoolNames(customFieldsBool);
        }).then(() => {
            if(isModify && collectionItemId !== 0) {
                fetchOneCollectionItem(collectionItemId).then((data) => {
                    setCustomFieldsValue((state) => ({...state, integer: {...state.integer, integerField1: data.integerField1}}));
                    setCustomFieldsValue((state) => ({...state, integer: {...state.integer, integerField2: data.integerField2}}));
                    setCustomFieldsValue((state) => ({...state, integer: {...state.integer, integerField3: data.integerField3}}));
                    setCustomFieldsValue((state) => ({...state, text: {...state.text, textField1: data.textField1}}));
                    setCustomFieldsValue((state) => ({...state, text: {...state.text, textField2: data.textField2}}));
                    setCustomFieldsValue((state) => ({...state, text: {...state.text, textField3: data.textField3}}));
                    setCustomFieldsValue((state) => ({...state, string: {...state.string, stringField1: data.stringField1}}));
                    setCustomFieldsValue((state) => ({...state, string: {...state.string, stringField2: data.stringField2}}));
                    setCustomFieldsValue((state) => ({...state, string: {...state.string, stringField3: data.stringField3}}));
                    setCustomFieldsValue((state) => ({...state, date: {...state.date, dateField1: data.dateField1 === null ? '' : data.dateField1.slice(0, 10)}}));
                    setCustomFieldsValue((state) => ({...state, date: {...state.date, dateField2: data.dateField2 === null ? '' : data.dateField1.slice(0, 10)}}));
                    setCustomFieldsValue((state) => ({...state, date: {...state.date, dateField3: data.dateField3 === null ? '' : data.dateField1.slice(0, 10)}}));
                    setCustomFieldsValue((state) => ({...state, bool: {...state.bool, boolField1: data.boolField1}}));
                    setCustomFieldsValue((state) => ({...state, bool: {...state.bool, boolField2: data.boolField2}}));
                    setCustomFieldsValue((state) => ({...state, bool: {...state.bool, boolField3: data.boolField3}}));
                    setName(data.name);
                    fetchAllItemTags(data.id).then((data) => {
                        setTags(data.map((item) => item[0].text));
                    });
                })
            }
        })
    }, [collectionId, collection, collectionItemId, isModify]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {isModify ? "Modify a collection item" : "Add new collection item"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label>Collection item name</Form.Label>
                <Form.Control className="collection-modal-input" value={name} onChange={e => setName(e.target.value)} placeholder={"Name..."}/>
                <Form.Label>Collection item tags</Form.Label>
                <TagsInput value={tags} onChange={setTags} name="tags" classNames={"tags-items"} placeHolder="Please press enter to add a tag"/>
                {integerNames.map((item) => 
                    <div key={item}>
                        <Form.Label>{item[1]}</Form.Label>
                        <Form.Control value={customFieldsValue.integer[item[0]]} onChange={(e) => setCustomFieldsValue((state) => ({...state, integer: {...state.integer, [item[0]]: e.target.value}}))} type="number" className="collection-modal-input"/>
                    </div>
                )}
                {textNames.map((item) => 
                    <div key={item}>
                        <Form.Label>{item[1]}</Form.Label>
                        <Form.Control value={customFieldsValue.text[item[0]]} onChange={(e) => setCustomFieldsValue((state) => ({...state, text: {...state.text, [item[0]]: e.target.value}}))} type="text" className="collection-modal-input"/>
                    </div>
                )}
                {stringNames.map((item) => 
                    <div key={item}>
                        <Form.Label>{item[1]}</Form.Label>
                        <Form.Control value={customFieldsValue.string[item[0]]} onChange={(e) => setCustomFieldsValue((state) => ({...state, string: {...state.string, [item[0]]: e.target.value}}))} as='textarea' className="collection-modal-input"/>
                    </div>
                )}
                {dateNames.map((item) => 
                    <div key={item}>
                        <Form.Label>{item[1]}</Form.Label>
                        <Form.Control value={customFieldsValue.date[item[0]]} onChange={(e) => setCustomFieldsValue((state) => ({...state, date: {...state.date, [item[0]]: e.target.value}}))} type="date" className="collection-modal-input"/>
                    </div>
                )}
                {boolNames.map((item) => 
                    <div key={item} className="d-flex">
                        <Form.Label>{item[1]}</Form.Label>
                        <Form.Check checked={customFieldsValue.bool[item[0]]} onChange={(e) => setCustomFieldsValue((state) => ({...state, bool: {...state.bool, [item[0]]: e.target.checked}}))} type="switch" style={{marginLeft: "0.6vw", marginTop: "0.1vw"}}/>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={closeModal}>Close</Button>
                <Button variant="outline-success" onClick={addCollection}> {isModify ? "Save" : "Add"}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewCollectionItemModal;
