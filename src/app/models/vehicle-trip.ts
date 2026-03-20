import { VehicleTripStatus } from "../enums/vehicle-trip-status";
import { VehicleAllocation } from "./vehicle-allocation";

export interface VehicleTrip {
    id: number,
    vehicleAllocationId: number,
    vehicleAllocation?: VehicleAllocation,
    origin: string,
    destination: string,
    startDate: Date,
    endDate?: Date,
    vehicleTripStatus: VehicleTripStatus,
    distance: number
}
