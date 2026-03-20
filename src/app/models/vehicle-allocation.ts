import { Driver } from "./driver"
import { Vehicle } from "./vehicle"

export interface VehicleAllocation {
    id: number,
    driverId: number,
    driver?: Driver
    vehicleId: number,
    vehicle?: Vehicle
    startDate: Date,
    endDate: Date
}
