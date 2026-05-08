import { VehicleStatus } from "../enums/vehicle-status";

export interface CreateVehicleDTO {
    licensePlate: string,
    vehicleModelId: number,
    chassisNumber: string,
    mileage: number,
    status: VehicleStatus,
    vehicleCondition: number,
    originCountry: string
}

export interface UpdateVehicleDTO {
    licensePlate: string,
    mileage: number,
    status: VehicleStatus,
    vehicleCondition: number,
    originCountry: string
}
