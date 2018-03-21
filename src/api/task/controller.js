import Controller from '../../common/controller';
import TaskModel from './model';

const debug = require('debug')('ido:task');

class TaskController extends Controller {
  beforeCreate(req, res, next) {
    debug('beforeCreate body add userId %O, %s', req.body, req.user.id);
    req.body.userId = req.user.id;
    next();
  }
}

export default new TaskController(TaskModel);
