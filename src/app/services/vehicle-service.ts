import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { CreateVehicleDTO, UpdateVehicleDTO } from '../dtos/create-update-vehicle-dto';
import { VehicleModel, CreateVehicleModelDTO } from '../models/vehicle-model';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpClient)
  private urlAPI = 'https://nexa-api-cilf.onrender.com/api/vehicles'
  private urlModelsAPI = 'https://nexa-api-cilf.onrender.com/api/vehicle-models'
  private urlTripsAPI = 'https://nexa-api-cilf.onrender.com/api/vehicle-trips'
  private urlTripEmployeesAPI = 'https://nexa-api-cilf.onrender.com/api/vehicle-trip-employees'

  private get authHeaders() {
    return { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }

  public getVehicles() {
    return this.http.get<Vehicle[]>(this.urlAPI, { headers: this.authHeaders })
  }

  public postVehicle(vehicle: CreateVehicleDTO) {
    return this.http.post<Vehicle>(this.urlAPI, vehicle, { headers: this.authHeaders })
  }

  public putVehicle(id: number, vehicle: UpdateVehicleDTO) {
    return this.http.put(`${this.urlAPI}/${id}`, vehicle, { headers: this.authHeaders })
  }

  public deleteVehicle(id: number) {
    return this.http.delete(`${this.urlAPI}/${id}`, { headers: this.authHeaders })
  }

  public getVehicleModels() {
    return this.http.get<VehicleModel[]>(this.urlModelsAPI, { headers: this.authHeaders })
  }

  public postVehicleModel(model: CreateVehicleModelDTO) {
    return this.http.post<VehicleModel>(this.urlModelsAPI, model, { headers: this.authHeaders })
  }

  public putVehicleModel(id: number, model: any) {
    return this.http.put(`${this.urlModelsAPI}/${id}`, model, { headers: this.authHeaders })
  }

  public deleteVehicleModel(id: number) {
    return this.http.delete(`${this.urlModelsAPI}/${id}`, { headers: this.authHeaders })
  }

  public getLastVehicleTrip(vehicleId: number) {
    return this.http.get<any>(`${this.urlTripsAPI}/last/vehicle/${vehicleId}`, {
      headers: this.authHeaders
    });
  }

  public postVehicleTrip(trip: any) {
    return this.http.post<any>(this.urlTripsAPI, trip, { headers: this.authHeaders });
  }

  public putVehicleTrip(id: number, trip: any) {
    return this.http.put<any>(`${this.urlTripsAPI}/${id}`, trip, { headers: this.authHeaders });
  }

  public postVehicleTripEmployee(vte: any) {
    return this.http.post<any>(this.urlTripEmployeesAPI, vte, { headers: this.authHeaders });
  }

  public deleteVehicleTripEmployee(id: number) {
    return this.http.delete<any>(`${this.urlTripEmployeesAPI}/${id}`, { headers: this.authHeaders });
  }
}
