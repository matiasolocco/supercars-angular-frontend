import { Component } from '@angular/core';
import { Vehicle } from '../../../interfaces/vehicle';
import { VehicleService } from '../../../services/vehicle.service';
import { DivisaPipe } from '../../../pipes/divisa.pipe';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterVehiclesPipe } from '../../../pipes/filter-vehicles.pipe';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [DivisaPipe, RouterModule, FormsModule, FilterVehiclesPipe],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent {
  vehicles: Vehicle[] = [];
  filtro: string = "";
  selectedVehicle: Vehicle | null = null;

  constructor(private vehicleService: VehicleService) {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getAll().subscribe({
      next: (response) => {
        this.vehicles = response as Vehicle[];
      },
      error: (error) => {
        console.error('Error al cargar los vehículos', error);
      }
    });
  }
}