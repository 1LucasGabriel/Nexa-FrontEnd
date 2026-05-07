import { Employee } from "./employee"
import { Housing } from "./housing"

export interface HousingAllocation {
    id: number;
    employeeId: number;
    employee?: Employee;
    housingId: number;
    housing?: Housing;
    checkInDate: string;
    checkOutDate?: string;
    housingRoomId?: number | null;
    housingRoom?: any | null;
}
