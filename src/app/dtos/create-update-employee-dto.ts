import { EmployeeStatus } from "../enums/employee-status";

export interface CreateUpdateEmployeeDTO {
    userId?: number,
    name: string,
    cpf: string,
    role: string,
    phoneNumber: string,
    hireDate: Date,
    status: EmployeeStatus
}