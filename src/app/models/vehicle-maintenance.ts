import { Vehicle } from "./vehicle"

export interface VehicleMaintenance {
    id: number,
    vehicleId: number,
    vehicle?: Vehicle,
    description: string,
    startDate: Date,
    endDate: Date,
    cost: number
}
