import { db } from '@back/adapters/db/pg.connector';
import { UserDTO } from '@dto';
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

export interface UserModel
  extends UserDTO,
    Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {}

const User = db.define<UserModel>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'lastname',
    },
    permission: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'createdat',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updatedat',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deletedat',
    },
  },
  { tableName: 'user' }
);
export default User;
