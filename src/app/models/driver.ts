import { User } from "./user"
import { Vehicle } from "./vehicle"

export interface Driver {
    id: number,
    userId: number,
    user?: User,
    licenseNumber: string,
    licenseExpiration: Date,
    licenseType: string,
    vehicleId: number,
    vehicle?: Vehicle
}
