import { sign } from '../../services/jwt';
import { success } from '../../services/response/';

export const login = ({ user }, res, next) =>
  sign(user.id)
    .then(token => ({ token, data: user.view(true) }))
    .then(success(res, 200))
    .catch(next);

export const logout = (req, res) => {
  req.logOut();
  res.status(200).end();
};
