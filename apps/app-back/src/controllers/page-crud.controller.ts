import { pageCrudService } from '@back/services';
import { AbstractCrudController } from './abstract-crud.controller';

class PageCrudController extends AbstractCrudController {
  constructor() {
    super(pageCrudService);
  }
}

const pageCrudController = new PageCrudController();

export default pageCrudController;
