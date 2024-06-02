import { Page } from '@back/models';
import { AbstractCrudService } from './abstract-crud.service';

class PageCrudService extends AbstractCrudService {
  constructor() {
    super(Page);
  }
}

const pageCrudService = new PageCrudService();

export default pageCrudService;
