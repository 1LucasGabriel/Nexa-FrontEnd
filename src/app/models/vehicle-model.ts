import { FuelType } from "../enums/fuel-type";
import { VehicleType } from "../enums/vehicle-type";

export interface VehicleModel {
    id: number,
    manufacturer: string,
    vehicleType: VehicleType,
    year: number,
    fuelType: FuelType,
    maxCapacity: number
}
