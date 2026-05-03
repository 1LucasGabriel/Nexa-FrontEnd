import { Component, Input, OnChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-card',
  imports: [CommonModule],
  templateUrl: './map-card.html',
  styleUrl: './map-card.scss',
})
export class MapCard implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  @Input() width: string = '100%';
  @Input() height: string = '400px';
  @Input() origin!: [number, number];
  @Input() destination!: [number, number];
  @Input() originLabel: string = '';
  @Input() destinationLabel: string = '';

  private map!: L.Map;
  private routeLayer?: L.Polyline;
  private markersLayer: L.Marker[] = [];
  routeDistance: string = '';
  routeDuration: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.initMap();
    if (this.origin && this.destination) {
      this.drawRoute();
    }
  }

  ngOnChanges() {
    if (this.map && this.origin && this.destination) {
      this.drawRoute();
    }
  }

  private initMap() {
    const center: L.LatLngExpression = this.origin || [0, 0];

    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false,
    }).setView(center, 8);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
  }

  private clearRoute() {
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
    }
    this.markersLayer.forEach((m) => this.map.removeLayer(m));
    this.markersLayer = [];
  }

  private createIcon(color: string): L.DivIcon {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 14px; height: 14px; border-radius: 50%;
        background: ${color}; border: 3px solid #fff;
        box-shadow: 0 0 8px ${color}88;
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  }

  private drawRoute() {
    this.clearRoute();
    this.loading = true;

    const [oLat, oLng] = this.origin;
    const [dLat, dLng] = this.destination;
    const url = `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        const route = res.routes[0];
        const coords: L.LatLngExpression[] = route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng] as L.LatLngExpression
        );

        this.routeLayer = L.polyline(coords, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.9,
        }).addTo(this.map);

        const originMarker = L.marker(this.origin, { icon: this.createIcon('#22c55e') })
          .bindTooltip(this.originLabel, { permanent: false, direction: 'top' })
          .addTo(this.map);

        const destMarker = L.marker(this.destination, { icon: this.createIcon('#ef4444') })
          .bindTooltip(this.destinationLabel, { permanent: false, direction: 'top' })
          .addTo(this.map);

        this.markersLayer = [originMarker, destMarker];
        this.map.fitBounds(this.routeLayer.getBounds(), { padding: [40, 40] });

        this.routeDistance = (route.distance / 1000).toFixed(1) + ' km';
        this.routeDuration = this.formatDuration(route.duration);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  }
}
