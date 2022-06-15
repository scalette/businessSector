const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findByPk(req.params.id, {attributes: {exclude: ['password','confirmPassword','updatedAt']}});
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit * 1 || 10;
    const offset = (page - 1) * limit;
    const options = {offset, limit: 10, order: [['createdAt', 'DESC']],attributes: {exclude: ['password','confirmPassword','updatedAt']}}
    const doc = await Model.findAll(options);
    doc.password = undefined;
    doc.confirmPassword = undefined;
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });
