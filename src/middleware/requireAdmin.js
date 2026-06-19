import { UnAuthorizedError } from "../utils/appError.js";

const requiredAdmin = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new UnAuthorizedError('You are not authorized for this action');
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default requiredAdmin;
