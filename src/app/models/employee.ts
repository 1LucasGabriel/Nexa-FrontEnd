import { EmployeeStatus } from "../enums/employee-status";
import { Housing } from "./housing";
import { User } from "./user";

export interface Employee {
    id: number,
    userId: number,
    user?: User,
    name: string,
    cpf: string,
    role: string,
    phoneNumber: string,
    hireDate: Date,
    employeeStatus: EmployeeStatus,
    housingId: number,
    housing?: Housing
}
