import PermissionType from '@/models/permission-type.model';
import BaseSerivce from '../core/http-clients/service.base';

export default class PermissionTypeService extends BaseSerivce<PermissionType>{
    constructor(public controller = 'PermissionType') {
        super(controller);
    }
}
