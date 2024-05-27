import { MagazineDTO } from '@dto';
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { db } from '../adapters/db/connection';

export interface MagazineModel
  extends MagazineDTO,
    Model<
      InferAttributes<MagazineModel>,
      InferCreationAttributes<MagazineModel>
    > {}

const Magazine = db.define<MagazineModel>(
  'Magazine',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    path: {
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
      defaultValue: DataTypes.NOW,
      field: 'createdat',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updatedat',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deletedat',
    },
  },
  { tableName: 'magazine' }
);
export default Magazine;
