import { AlertSeverity } from "../enums/alert";
export interface GetHomePageDTO {
    employees: Employees;
    housingOccupation: HousingOccupation;
    vehicleDisponibility: VehicleDisponibility;
    alerts: Alerts;
}

interface Employees {
    total: number;
    active: number;
    activeRate: number;
}

interface HousingOccupation {
    currentOccupation: number;
    maxCapacity: number;
    occupancyRate: number;
}

interface VehicleDisponibility {
    total: number;
    available: number;
    availabilityRate: number;
}

interface Alerts {
    totalActive: number;
    criticalCount: number;
    recentAlerts: Alert[];
}

interface Alert {
    message: string;
    subtitle: string;
    time: string;
    severity: AlertSeverity;
}