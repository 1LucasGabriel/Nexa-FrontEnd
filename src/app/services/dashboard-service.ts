import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private urlAPI = 'https://nexa-api-cilf.onrender.com/api/dashboard';

  public getOccupancyEvolution(startDate?: string, endDate?: string) {
    let url = `${this.urlAPI}/occupancy-evolution`;
    const params: string[] = [];
    if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`);
    if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    return this.http.get<any[]>(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  public getVehicleRanking(startDate?: string, endDate?: string) {
    let url = `${this.urlAPI}/vehicle-ranking`;
    const params: string[] = [];
    if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`);
    if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    return this.http.get<any[]>(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
