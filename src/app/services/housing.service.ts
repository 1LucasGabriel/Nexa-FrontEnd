import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Housing } from '../models/housing';
import { HousingAllocation } from '../models/housing-allocation';
import { VehicleTrip } from '../models/vehicle-trip';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private http = inject(HttpClient);
  private urlAPI = 'https://localhost:8081/api';

  public getHousings() {
    return this.http.get<Housing[]>(`${this.urlAPI}/housings`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public postHousing(housing: any) {
    return this.http.post<Housing>(`${this.urlAPI}/housings`, housing, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public putHousing(id: number, housing: any) {
    return this.http.put(`${this.urlAPI}/housings/${id}`, housing, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public deleteHousing(id: number) {
    return this.http.delete(`${this.urlAPI}/housings/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public getHousingAllocations(housingId: number) {
    return this.http.get<HousingAllocation[]>(`${this.urlAPI}/housing-allocations/housing/${housingId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public getVehicleTrips(housingId: number) {
    return this.http.get<VehicleTrip[]>(`${this.urlAPI}/vehicle-trips/housing/${housingId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
