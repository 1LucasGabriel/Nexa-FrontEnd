import { HousingStatus } from "../enums/housing-status";
import { Address } from "./address";

export interface Housing {
    id: number;
    name: string;
    addressId: number;
    maxCapacity: number;
    currentCapacity: number;
    housingStatus: HousingStatus;
    housingType: number;
    useHousingRoom: boolean;
    address?: Address;
}
