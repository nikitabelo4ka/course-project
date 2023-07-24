import { React, useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Context } from '../index';
import { createCollection, modifyCollection, fetchOneCollection, fetchCollections } from '../http/collectionAPI';
import jwtDecode from 'jwt-decode';
import { IKContext, IKUpload } from 'imagekitio-react';
import { collectionThemes } from '../utils/consts';

const NewCollectionModal = ({ show, onHide, userId, info, isModify }) => {
  const { collection } = useContext(Context);

  const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null;

  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [otherTheme, setOtherTheme] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState('no_image.jpg');

  const [isCheckboxActive, setIsCheckboxActive] = useState({
    integer: false,
    text: false,
    string: false,
    date: false,
    bool: false,
  });

  const [isCheckboxChecked, setIsCheckboxChecked] = useState({
    integer: {
      first: true,
      second: false,
      third: false,
    },
    text: {
      first: true,
      second: false,
      third: false,
    },
    string: {
      first: true,
      second: false,
      third: false,
    },
    date: {
      first: true,
      second: false,
      third: false,
    },
    bool: {
      first: true,
      second: false,
      third: false,
    },
  });

  const [customFieldsValue, setCustomFieldsValue] = useState({
    integer: {
      first: '',
      second: '',
      third: '',
    },
    text: {
      first: '',
      second: '',
      third: '',
    },
    string: {
      first: '',
      second: '',
      third: '',
    },
    date: {
      first: '',
      second: '',
      third: '',
    },
    bool: {
      first: '',
      second: '',
      third: '',
    },
  });

  useEffect(() => {
    fetchCollections()
      .then((data) => collection.setCollections(data))
      .then(() => {
        if (isModify) {
          fetchOneCollection(info.id).then((data) => {
            setName(data.name);
            if (data.theme !== collectionThemes) {
              setTheme('Other');
              setOtherTheme(data.theme);
              console.log(data.theme);
              console.log(otherTheme);
            } else {
              setTheme(data.theme);
            }
            setDescription(data.description);
            setImages(data.images);
            setIsCheckboxActive((state) => ({
              ...state,
              integer: [data.integerField1, data.integerField2, data.integerField3].filter((item) => item).length > 0,
            }));
            setIsCheckboxActive((state) => ({
              ...state,
              text: [data.textField1, data.textField2, data.textField3].filter((item) => item).length > 0,
            }));
            setIsCheckboxActive((state) => ({
              ...state,
              string: [data.stringField1, data.stringField2, data.stringField3].filter((item) => item).length > 0,
            }));
            setIsCheckboxActive((state) => ({
              ...state,
              date: [data.dateField1, data.dateField2, data.dateField3].filter((item) => item).length > 0,
            }));
            setIsCheckboxActive((state) => ({
              ...state,
              bool: [data.boolField1, data.boolField2, data.boolField3].filter((item) => item).length > 0,
            }));
            setCustomFieldsValue((state) => ({ ...state, integer: { ...state.integer, first: data.integerField1 } }));
            setCustomFieldsValue((state) => ({ ...state, integer: { ...state.integer, second: data.integerField2 } }));
            setCustomFieldsValue((state) => ({ ...state, integer: { ...state.integer, third: data.integerField3 } }));
            setCustomFieldsValue((state) => ({ ...state, text: { ...state.text, first: data.textField1 } }));
            setCustomFieldsValue((state) => ({ ...state, text: { ...state.text, second: data.textField2 } }));
            setCustomFieldsValue((state) => ({ ...state, text: { ...state.text, third: data.textField3 } }));
            setCustomFieldsValue((state) => ({ ...state, string: { ...state.string, first: data.stringField1 } }));
            setCustomFieldsValue((state) => ({ ...state, string: { ...state.string, second: data.stringField2 } }));
            setCustomFieldsValue((state) => ({ ...state, string: { ...state.string, third: data.stringField3 } }));
            setCustomFieldsValue((state) => ({ ...state, date: { ...state.date, first: data.dateField1 } }));
            setCustomFieldsValue((state) => ({ ...state, date: { ...state.date, second: data.dateField2 } }));
            setCustomFieldsValue((state) => ({ ...state, date: { ...state.date, third: data.dateField3 } }));
            setCustomFieldsValue((state) => ({ ...state, bool: { ...state.bool, first: data.boolField1 } }));
            setCustomFieldsValue((state) => ({ ...state, bool: { ...state.bool, second: data.boolField2 } }));
            setCustomFieldsValue((state) => ({ ...state, bool: { ...state.bool, third: data.boolField3 } }));
            setIsCheckboxChecked((state) => ({
              ...state,
              integer: { ...state.integer, first: Boolean(data.integerField1) },
            }));
            setIsCheckboxChecked((state) => ({
              ...state,
              integer: { ...state.integer, second: Boolean(data.integerField2) },
            }));
            setIsCheckboxChecked((state) => ({
              ...state,
              integer: { ...state.integer, third: Boolean(data.integerField3) },
            }));
            setIsCheckboxChecked((state) => ({ ...state, text: { ...state.text, first: Boolean(data.textField1) } }));
            setIsCheckboxChecked((state) => ({ ...state, text: { ...state.text, second: Boolean(data.textField2) } }));
            setIsCheckboxChecked((state) => ({ ...state, text: { ...state.text, third: Boolean(data.textField3) } }));
            setIsCheckboxChecked((state) => ({
              ...state,
              string: { ...state.string, first: Boolean(data.stringField1) },
            }));
            setIsCheckboxChecked((state) => ({
              ...state,
              string: { ...state.string, second: Boolean(data.stringField2) },
            }));
            setIsCheckboxChecked((state) => ({
              ...state,
              string: { ...state.string, third: Boolean(data.stringField3) },
            }));
            setIsCheckboxChecked((state) => ({ ...state, date: { ...state.date, first: Boolean(data.dateField1) } }));
            setIsCheckboxChecked((state) => ({ ...state, date: { ...state.date, second: Boolean(data.dateField2) } }));
            setIsCheckboxChecked((state) => ({ ...state, date: { ...state.date, third: Boolean(data.dateField3) } }));
            setIsCheckboxChecked((state) => ({ ...state, bool: { ...state.bool, first: Boolean(data.boolField1) } }));
            setIsCheckboxChecked((state) => ({ ...state, bool: { ...state.bool, second: Boolean(data.boolField2) } }));
            setIsCheckboxChecked((state) => ({ ...state, bool: { ...state.bool, third: Boolean(data.boolField3) } }));
          });
        }
      });
  }, [collection, isModify, show]);

  const addCollection = (e) => {
    e.preventDefault();
    if (isModify) {
      modifyCollection(
        info.id,
        name,
        theme === 'Other' ? otherTheme : theme,
        images,
        description,
        JSON.stringify([
          ...Object.values(customFieldsValue.integer),
          ...Object.values(customFieldsValue.text),
          ...Object.values(customFieldsValue.string),
          ...Object.values(customFieldsValue.date),
          ...Object.values(customFieldsValue.bool),
        ]),
      ).then((data) => onHide());
    } else {
      createCollection(
        name,
        theme === 'Other' ? otherTheme : theme,
        images,
        description,
        JSON.stringify([
          ...Object.values(customFieldsValue.integer),
          ...Object.values(customFieldsValue.text),
          ...Object.values(customFieldsValue.string),
          ...Object.values(customFieldsValue.date),
          ...Object.values(customFieldsValue.bool),
        ]),
        userId === undefined ? token.id : userId,
      ).then((data) => {
        onHide();
      });
    }
  };

  const onError = (err) => {
    console.log('Error', err);
  };

  const onSuccess = (res) => {
    setImages(res.filePath);
  };

  const checkboxChange = (e, type) => {
    setIsCheckboxActive((state) => ({ ...state, [type]: e.target.checked }));
    setCustomFieldsValue((state) => ({ ...state, [type]: { ...state[type], first: '' } }));
    setCustomFieldsValue((state) => ({ ...state, [type]: { ...state[type], second: '' } }));
    setCustomFieldsValue((state) => ({ ...state, [type]: { ...state[type], third: '' } }));
    setIsCheckboxChecked((state) => ({ ...state, [type]: { ...state[type], first: true } }));
    setIsCheckboxChecked((state) => ({ ...state, [type]: { ...state[type], second: false } }));
    setIsCheckboxChecked((state) => ({ ...state, [type]: { ...state[type], third: false } }));
  };

  const checkboxValueChange = (e, type, index) => {
    setIsCheckboxChecked((state) => ({ ...state, [type]: { ...state[type], [index]: e.target.checked } }));
    setCustomFieldsValue((state) => ({ ...state, [type]: { ...state[type], [index]: '' } }));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {isModify ? 'Modify a collection' : 'Add a collection'}
        </Modal.Title>
      </Modal.Header>
      <Form className="d-flex flex-column" onSubmit={addCollection}>
        <Modal.Body>
          <Form.Label>Collection name</Form.Label>
          <Form.Control
            className="collection-modal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={'Name...'}
            required
          />
          <Form.Label>Collection theme</Form.Label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="form-select collection-modal-input"
            aria-label="Default select example"
            required
          >
            {collectionThemes.map((theme) => (
              <option key={theme}>{theme}</option>
            ))}
          </select>
          <Form.Control
            className={theme === 'Other' ? 'collection-modal-input' : 'none'}
            value={otherTheme}
            onChange={(e) => setOtherTheme(e.target.value)}
            placeholder={'Other theme...'}
          />
          <Form.Label>Collection description</Form.Label>
          <Form.Control
            className="collection-modal-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={'Description...'}
            as="textarea"
            required
          />
          <Form.Label>Collection image</Form.Label>
          <IKContext
            publicKey={process.env.REACT_APP_PUBLIC_KEY}
            urlEndpoint={process.env.REACT_APP_URL_ENDPOINT}
            authenticationEndpoint={process.env.REACT_APP_AUTHENTIFICATION_ENDPOINT}
          >
            <IKUpload className="file-input" onError={onError} onSuccess={onSuccess} />
          </IKContext>
          <Form.Label>Select the fields, which will be used for each item in the collection</Form.Label>
          <Form.Check
            checked={isCheckboxActive.integer}
            onChange={(e) => checkboxChange(e, 'integer')}
            type="switch"
            id="custom-switch"
            label="Integer fields"
          />
          <div className={isCheckboxActive.integer ? 'd-flex collection-fields-wrapper' : 'none'}>
            <Form.Label>Names</Form.Label>
            <div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.integer.first}
                  onChange={(e) => checkboxValueChange(e, 'integer', 'first')}
                  label="1"
                  id="collection-field-1"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.integer.first}
                  required={isCheckboxChecked.integer.first ? 'required' : 'no'}
                  disabled={isCheckboxChecked.integer.first ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({
                      ...state,
                      integer: { ...state.integer, first: e.target.value },
                    }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.integer.second}
                  onChange={(e) => checkboxValueChange(e, 'integer', 'second')}
                  label="2"
                  id="collection-field-2"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.integer.second}
                  required={isCheckboxChecked.integer.second ? 'required' : 'no'}
                  disabled={isCheckboxChecked.integer.second ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({
                      ...state,
                      integer: { ...state.integer, second: e.target.value },
                    }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.integer.third}
                  onChange={(e) => checkboxValueChange(e, 'integer', 'third')}
                  label="3"
                  id="collection-field-3"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.integer.third}
                  required={isCheckboxChecked.integer.third ? 'required' : 'no'}
                  disabled={isCheckboxChecked.integer.third ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({
                      ...state,
                      integer: { ...state.integer, third: e.target.value },
                    }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
            </div>
          </div>
          <Form.Check
            checked={isCheckboxActive.text}
            onChange={(e) => checkboxChange(e, 'text')}
            type="switch"
            id="custom-switch"
            label="Text fields"
          />
          <div className={isCheckboxActive.text ? 'd-flex collection-fields-wrapper' : 'none'}>
            <Form.Label>Names</Form.Label>
            <div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.text.first}
                  onChange={(e) => checkboxValueChange(e, 'text', 'first')}
                  label="1"
                  id="collection-field-1"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.text.first}
                  required={isCheckboxChecked.text.first ? 'required' : 'no'}
                  disabled={isCheckboxChecked.text.first ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, text: { ...state.text, first: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.text.second}
                  onChange={(e) => checkboxValueChange(e, 'text', 'second')}
                  label="2"
                  id="collection-field-2"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.text.second}
                  required={isCheckboxChecked.text.second ? 'required' : 'no'}
                  disabled={isCheckboxChecked.text.second ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, text: { ...state.text, second: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.text.third}
                  onChange={(e) => checkboxValueChange(e, 'text', 'third')}
                  label="3"
                  id="collection-field-3"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.text.third}
                  required={isCheckboxChecked.text.third ? 'required' : 'no'}
                  disabled={isCheckboxChecked.text.third ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, text: { ...state.text, third: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
            </div>
          </div>
          <Form.Check
            checked={isCheckboxActive.string}
            onChange={(e) => checkboxChange(e, 'string')}
            type="switch"
            id="custom-switch"
            label="String fields"
          />
          <div className={isCheckboxActive.string ? 'd-flex collection-fields-wrapper' : 'none'}>
            <Form.Label>Names</Form.Label>
            <div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.string.first}
                  onChange={(e) => checkboxValueChange(e, 'string', 'first')}
                  label="1"
                  id="collection-field-1"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.string.first}
                  required={isCheckboxChecked.string.first ? 'required' : 'no'}
                  disabled={isCheckboxChecked.string.first ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, string: { ...state.string, first: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.string.second}
                  onChange={(e) => checkboxValueChange(e, 'string', 'second')}
                  label="2"
                  id="collection-field-2"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.string.second}
                  required={isCheckboxChecked.string.second ? 'required' : 'no'}
                  disabled={isCheckboxChecked.string.second ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, string: { ...state.string, second: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.string.third}
                  onChange={(e) => checkboxValueChange(e, 'string', 'third')}
                  label="3"
                  id="collection-field-3"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.string.third}
                  required={isCheckboxChecked.string.third ? 'required' : 'no'}
                  disabled={isCheckboxChecked.string.third ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, string: { ...state.string, third: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
            </div>
          </div>
          <Form.Check
            checked={isCheckboxActive.date}
            onChange={(e) => checkboxChange(e, 'date')}
            type="switch"
            id="custom-switch"
            label="Date fields"
          />
          <div className={isCheckboxActive.date ? 'd-flex collection-fields-wrapper' : 'none'}>
            <Form.Label>Names</Form.Label>
            <div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.date.first}
                  onChange={(e) => checkboxValueChange(e, 'date', 'first')}
                  label="1"
                  id="collection-field-1"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.date.first}
                  required={isCheckboxChecked.date.first ? 'required' : 'no'}
                  disabled={isCheckboxChecked.date.first ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, date: { ...state.date, first: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.date.second}
                  onChange={(e) => checkboxValueChange(e, 'date', 'second')}
                  label="2"
                  id="collection-field-2"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.date.second}
                  required={isCheckboxChecked.date.second ? 'required' : 'no'}
                  disabled={isCheckboxChecked.date.second ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, date: { ...state.date, second: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.date.third}
                  onChange={(e) => checkboxValueChange(e, 'date', 'third')}
                  label="3"
                  id="collection-field-3"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.date.third}
                  required={isCheckboxChecked.date.third ? 'required' : 'no'}
                  disabled={isCheckboxChecked.date.third ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, date: { ...state.date, third: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
            </div>
          </div>
          <Form.Check
            checked={isCheckboxActive.bool}
            onChange={(e) => checkboxChange(e, 'bool')}
            type="switch"
            id="custom-switch"
            label="Yes/No fields"
          />
          <div className={isCheckboxActive.bool ? 'd-flex collection-fields-wrapper' : 'none'}>
            <Form.Label>Names</Form.Label>
            <div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.bool.first}
                  onChange={(e) => checkboxValueChange(e, 'bool', 'first')}
                  label="1"
                  id="collection-field-1"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.bool.first}
                  required={isCheckboxChecked.bool.first ? 'required' : 'no'}
                  disabled={isCheckboxChecked.bool.first ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, bool: { ...state.bool, first: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.bool.second}
                  onChange={(e) => checkboxValueChange(e, 'bool', 'second')}
                  label="2"
                  id="collection-field-2"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.bool.second}
                  required={isCheckboxChecked.bool.second ? 'required' : 'no'}
                  disabled={isCheckboxChecked.bool.second ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, bool: { ...state.bool, second: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
              <div className="collection-field-input-wrapper">
                <Form.Check
                  checked={isCheckboxChecked.bool.third}
                  onChange={(e) => checkboxValueChange(e, 'bool', 'third')}
                  label="3"
                  id="collection-field-3"
                  className="collection-checkbox"
                />
                <Form.Control
                  value={customFieldsValue.bool.third}
                  required={isCheckboxChecked.bool.third ? 'required' : 'no'}
                  disabled={isCheckboxChecked.bool.third ? '' : 'disabled'}
                  onChange={(e) =>
                    setCustomFieldsValue((state) => ({ ...state, bool: { ...state.bool, third: e.target.value } }))
                  }
                  className="collection-custom-field-input"
                  placeholder="Field name"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>
            Close
          </Button>
          <Button variant="outline-success" type="submit">
            {isModify ? 'Save' : 'Add'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NewCollectionModal;
