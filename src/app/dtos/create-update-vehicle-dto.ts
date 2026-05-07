import { VehicleStatus } from "../enums/vehicle-status";

export interface CreateUpdateVehicleDTO {
    licensePlate: string,
    vehicleModelId: number,
    chassisNumber: string,
    mileage: number,
    status: VehicleStatus
}
