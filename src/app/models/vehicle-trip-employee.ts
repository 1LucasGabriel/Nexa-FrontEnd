import { Employee } from "./employee";

export interface VehicleTripEmployee {
    id: number;
    vehicleTripId: number;
    employeeId: number;
    employee?: Employee;
}
