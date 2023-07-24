import { makeAutoObservable } from 'mobx';

export default class TagStore {
  constructor() {
    this._tags = [];
    this._itemTags = [];
    makeAutoObservable(this);
  }

  setTags(tags) {
    this._tags = tags;
  }

  setItemTags(tags) {
    this._itemTags = tags;
  }

  get tags() {
    return this._tags;
  }

  get itemTags() {
    return this._itemTags;
  }
}
