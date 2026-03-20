import { Employee } from "./employee"
import { Housing } from "./housing"

export interface HousingAllocation {
    id: number,
    employeeId: number,
    employee?: Employee
    housingId: number,
    housing?: Housing
    checkInDate: Date,
    checkOutDate: Date
}
