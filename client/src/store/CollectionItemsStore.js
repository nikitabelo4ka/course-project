import { makeAutoObservable } from 'mobx';

export default class CollectionItemsStore {
  constructor() {
    this._collectionItems = [];
    this._allItems = [];
    makeAutoObservable(this);
  }

  setCollectionItems(collectionItems) {
    this._collectionItems = collectionItems;
  }

  setAllItems(items) {
    this._allItems = items;
  }

  get collectionItems() {
    return this._collectionItems;
  }

  get allItems() {
    return this._allItems;
  }
}
