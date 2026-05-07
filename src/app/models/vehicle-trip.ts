import { VehicleTripStatus } from "../enums/vehicle-trip-status";
import { Vehicle } from "./vehicle";
import { VehicleTripEmployee } from "./vehicle-trip-employee";

export interface VehicleTrip {
    id: number;
    driverId: number;
    vehicleId: number;
    originAddressId: number;
    destinationAddressId: number;
    startDate: string;
    endDate?: string | null;
    status: VehicleTripStatus;
    distance: number;
    description: string;
    currentOcupation: number;
    vehicle?: Vehicle;
    listVehicleTripEmployee?: VehicleTripEmployee[];
}
