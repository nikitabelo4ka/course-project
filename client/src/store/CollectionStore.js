import {makeAutoObservable} from "mobx";

export default class CollectionStore {

    constructor() {
        this._collections = []
        this._userCollections = []
        this._selectedCollection = {}
        makeAutoObservable(this)
    }

    setCollections(collections) {
        this._collections = collections
    }

    setUserCollections(collections) {
        this._userCollections = collections
    }

    setSelectedCollection(collection) {
        this._selectedCollection = collection
    }

    get collections() {
        return this._collections
    }

    get selectedCollection() {
        return this._selectedCollection
    }

    get userCollections() {
        return this._userCollections
    }
    
}
