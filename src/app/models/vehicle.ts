import { VehicleStatus } from "../enums/vehicle-status";
import { VehicleModel } from "./vehicle-model";

export interface Vehicle {
    id: number,
    licensePlate: string,
    vehicleModelId: number,
    vehicleModel?: VehicleModel
    chassisNumber: string,
    mileage: number,
    status: VehicleStatus
}
