'use strict';

const bcrypt = require('bcryptjs');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UsersInfo.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type:  DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 10], 
          msg: "Must be between 5 and 10 symbols"}
      }
    },
    confirmPassword: {
      type:  DataTypes.STRING,
      validate: {
        customValidator(el) {
          if(el !== this.password){
            throw new Error("The passwordd must be equal");
          }
        },
      },
    },
    sex: DataTypes.STRING,
    photo: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'UsersInfo',
    tableName: 'UsersInfo',
  });
  UsersInfo.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 12);
    //delete the passwordConfirm field
    user.confirmPassword = undefined;
  });
  UsersInfo.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  return UsersInfo;
};