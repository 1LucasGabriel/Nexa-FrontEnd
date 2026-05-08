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
  private urlAPI = 'http://localhost:5102/api/vehicles'
  private urlModelsAPI = 'http://localhost:5102/api/vehicle-models'

  public getVehicles() {
    return this.http.get<Vehicle[]>(this.urlAPI, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public postVehicle(vehicle: CreateVehicleDTO) {
    return this.http.post<Vehicle>(this.urlAPI, vehicle, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public putVehicle(id: number, vehicle: UpdateVehicleDTO) {
    return this.http.put(`${this.urlAPI}/${id}`, vehicle, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public deleteVehicle(id: number) {
    return this.http.delete(`${this.urlAPI}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  public postVehicleModel(model: CreateVehicleModelDTO) {
    return this.http.post<VehicleModel>(this.urlModelsAPI, model, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
}
