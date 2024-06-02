import { db } from '@back/adapters/db/pg.connector';
import { PageDTO } from '@dto';
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { Magazine } from '.';

export interface PageModel
  extends PageDTO,
    Model<InferAttributes<PageModel>, InferCreationAttributes<PageModel>> {}

const Page = db.define<PageModel>(
  'Page',
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    magazineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'magazine_id',
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
  { tableName: 'page' }
);

Page.belongsTo(Magazine, { foreignKey: 'magazineId' });

export default Page;
