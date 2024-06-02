import { User } from '@back/models';
import { AbstractCrudService } from './abstract-crud.service';

class UserCrudService extends AbstractCrudService {
  constructor() {
    super(User);
  }
}

const userCrudService = new UserCrudService();

export default userCrudService;
