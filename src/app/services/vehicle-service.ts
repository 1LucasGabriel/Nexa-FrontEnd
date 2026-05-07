import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { CreateUpdateVehicleDTO } from '../dtos/create-update-vehicle-dto';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpClient)
  private urlAPI = 'http://localhost:5102/api/vehicles'

  public getVehicles() {
    const url = `${this.urlAPI}`
    return this.http.get<Vehicle[]>(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public postVehicle(vehicle: CreateUpdateVehicleDTO) {
    const url = `${this.urlAPI}`
    return this.http.post<Vehicle>(url, vehicle, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public putVehicle(id: number, vehicle: CreateUpdateVehicleDTO) {
    const url = `${this.urlAPI}/${id}`
    return this.http.put(url, vehicle, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public deleteVehicle(id: number) {
    const url = `${this.urlAPI}/${id}`
    return this.http.delete(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}
