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
  private urlAPI = 'https://nexa-api-cilf.onrender.com/api';

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

  public postHousingAllocation(payload: any) {
    return this.http.post<HousingAllocation>(`${this.urlAPI}/housing-allocations`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public putHousingAllocation(id: number, payload: any) {
    return this.http.put<any>(`${this.urlAPI}/housing-allocations/${id}`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public deleteHousingAllocation(id: number) {
    return this.http.delete<any>(`${this.urlAPI}/housing-allocations/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public getHousingRooms() {
    return this.http.get<any[]>(`${this.urlAPI}/housing-rooms`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public postHousingRoom(payload: any) {
    return this.http.post<any>(`${this.urlAPI}/housing-rooms`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public deleteHousingRoom(id: number) {
    return this.http.delete<any>(`${this.urlAPI}/housing-rooms/${id}`, {
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
