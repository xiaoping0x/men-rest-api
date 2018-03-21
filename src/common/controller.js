import { success, notFound } from '../services/response/';

export default class Controller {
  constructor(model) {
    this.model = model;
    this.modelFields = this.getFields(model);
  }

  getFields(model) {
    const modelFields = Object.assign({}, model.schema.tree);
    ['id', '_id', '__v'].forEach(key => delete modelFields[key]);
    return modelFields;
  }

  getCreateFields() {
    return this.modelFields;
  }

  getUpdateFields() {
    return this.getCreateFields();
  }

  index({ querymen: { query, select, cursor } }, res, next) {
    return this.model
      .count(query)
      .then(count =>
        this.model.find(query, select, cursor).then(items => ({
          count,
          rows: items.map(item => item.view()),
        })))
      .then(success(res))
      .catch(next);
  }

  show({ params }, res, next) {
    return this.model
      .findById(params.id)
      .then(notFound(res))
      .then(item => (item ? item.view() : null))
      .then(success(res))
      .catch(next);
  }

  create({ bodymen: { body } }, res, next) {
    return this.model
      .create(body)
      .then(item => item.view(true))
      .then(success(res, 201))
      .catch(next);
  }

  update({ bodymen: { body }, params }, res, next) {
    return this.model
      .findById(params.id)
      .then(notFound(res))
      .then(item => (item ? Object.assign(item, body).save() : null))
      .then(item => (item ? item.view(true) : null))
      .then(success(res))
      .catch(next);
  }

  destroy({ params }, res, next) {
    return this.model
      .findById(params.id)
      .then(notFound(res))
      .then(item => (item ? item.remove() : null))
      .then(success(res, 204))
      .catch(next);
  }
}
