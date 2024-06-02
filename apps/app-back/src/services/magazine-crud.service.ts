import { Magazine } from '@back/models';
import { AbstractCrudService } from './abstract-crud.service';

class MagazineCrudService extends AbstractCrudService {
  constructor() {
    super(Magazine);
  }
}

const magazineCrudService = new MagazineCrudService();

export default magazineCrudService;
