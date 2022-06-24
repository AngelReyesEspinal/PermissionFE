import BaseEntity from '@/core/models/base-entity.model';

export default class Permission extends BaseEntity {
    employeeFirstName: string = ''; 
    employeeLastName: string = '';
    permissionDate: Date = new Date();
    permissionTypeId?: number | null = null;
    permissionTypeDescription: string = '';
}