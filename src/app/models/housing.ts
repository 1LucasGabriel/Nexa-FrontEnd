import { HousingStatus } from "../enums/housing-status";

export interface Housing {
    id: number,
    name: string,
    address: string,
    city: string,
    zipCode: string,
    maxCapacity: number,
    currentCapacity: number,
    housingStatus: HousingStatus
}
