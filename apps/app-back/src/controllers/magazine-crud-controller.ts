import { magazineCrudService } from '../services';
import { AbstractCrudController } from './abstract-crud-controller';

class MagazineCrudController extends AbstractCrudController {
  constructor() {
    super(magazineCrudService);
  }
}

const magazineCrudController = new MagazineCrudController();

export default magazineCrudController;
