export interface CreateDriverDto {
  licenseNumber: string;
  licenseExpiration: string; // ISO date string
  licenseType: string;
  vehicleId: number | null;
}
