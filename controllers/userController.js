const multer = require('multer');
const sharp = require('sharp');
const {UsersInfo} = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowerdFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowerdFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user;
  next();
};

exports.updateUser = catchAsync(async (req, res, next) => {
  // 1. Create erroe if user POST password data
  if (req.body.password || req.body.confirmPassword|| req.body.createdAt) {
    return next(
      new AppError(
        'This route is not for password updates, please use /updateMyPassword',
        400
      )
    );
  }
  // 2. Filtered out unwanted fields names that are not allowd to be updated
  const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email', 'sex');
  if (req.file) filteredBody.photo = req.file.filename;
  // 2. Update user document

  const doc = await UsersInfo.findByPk(req.params.id, {attributes: {exclude: ['password','confirmPassword','updatedAt']}});
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  doc.set(filteredBody);
  doc.save();
  res.status(200).json({
    status: 'success',
    data: {
      user: doc,
    },
  });
});


exports.getAllUsers = factory.getAll(UsersInfo);
exports.getUser = factory.getOne(UsersInfo);
