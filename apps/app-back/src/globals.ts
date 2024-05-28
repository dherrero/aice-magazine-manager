import path from 'path';

export const UPLOAD_DIR = process.env.NODE_UPLOAD_FILES
  ? path.join(process.cwd(), `${process.env.NODE_UPLOAD_FILES}`)
  : path.join(process.cwd(), 'uploads');
