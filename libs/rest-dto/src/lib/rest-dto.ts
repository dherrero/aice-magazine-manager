declare const CreationAttributeBrand: unique symbol;

export type CreationOptional<T> =
  // copied from sequelize's Model
  T extends null | undefined ? T : T & { [CreationAttributeBrand]?: true };

export interface UserDTO {
  id: CreationOptional<number>;
  email: string;
  name: string;
  password: string;
  lastName: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface MagazineDTO {
  id: CreationOptional<number>;
  number: number;
  path: string;
  publhishedAt: Date;
  image?: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface PageDTO {
  id: CreationOptional<number>;
  number: number;
  content: string;
  magazineId: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface SearchDTO extends PageDTO {
  Magazine: MagazineDTO;
}
