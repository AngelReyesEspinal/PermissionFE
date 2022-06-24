import Permission from '@/models/permission.model';
import BaseSerivce from '../core/http-clients/service.base';

export default class PermissionService extends BaseSerivce<Permission>{
    constructor(public controller = 'Permission') {
        super(controller);
    }

    
}
