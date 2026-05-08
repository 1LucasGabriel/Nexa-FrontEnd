import { FuelType } from "../enums/fuel-type";
import { VehicleType } from "../enums/vehicle-type";

export interface VehicleModel {
    id: number,
    manufacturer: string,
    model: string,
    type: VehicleType,
    year: number,
    fuelType: FuelType,
    maxCapacity: number
}

export interface CreateVehicleModelDTO {
    manufacturer: string,
    model: string,
    type: number,
    year: number,
    fuelType: number,
    maxCapacity: number
}
