import { Component } from '@angular/core';
import { Vehicle } from '../../../interfaces/vehicle';
import { VehicleService } from '../../../services/vehicle.service';
import { DivisaPipe } from '../../../pipes/divisa.pipe';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterVehiclesPipe } from '../../../pipes/filter-vehicles.pipe';
import Swal from 'sweetalert2';

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

  editar(vehicleId: string) {
    console.log('ID del vehiculo a editar:', vehicleId);
    const vehicle = this.vehicles.find(v => v._id === vehicleId);
    console.log('Vehiculo encontrado:', vehicle);

    if (vehicle) {
        Swal.fire({
            title: `Editar vehículo ${vehicle.brand} ${vehicle.model}`,
            html: `<div>
              <div>
                <label class="form-label">Marca</label>
                <input id="brand" type="text" class="form-control" value="${vehicle.brand}">
              </div>
              <div>
                <label class="form-label">Modelo</label>
                <input id="model" type="text" class="form-control" value="${vehicle.model}">
              </div>
              <div>
                <label class="form-label">Descripción</label>
                <input id="description" type="text" class="form-control" value="${vehicle.description}">
              </div>
              <div>
                <label class="form-label">Precio por día</label>
                <input id="pricePerDay" type="number" class="form-control" value="${vehicle.pricePerDay}">
              </div>
              <div>
                <label class="form-label">Año</label>
                <input id="year" type="number" class="form-control" value="${vehicle.year}">
              </div>
            </div>`,
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const brand = (document.getElementById('brand') as HTMLInputElement).value;
                const model = (document.getElementById('model') as HTMLInputElement).value;
                const description = (document.getElementById('description') as HTMLInputElement).value;
                const pricePerDay = parseFloat((document.getElementById('pricePerDay') as HTMLInputElement).value);
                const year = parseInt((document.getElementById('year') as HTMLInputElement).value, 10);
                console.log('Datos de vehiculo actualizados:', { brand, model, description, pricePerDay, year });
                return { brand, model, description, pricePerDay, year };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedVehicle = result.value;
                console.log('Datos confirmados para actualizar', updatedVehicle);
                this.vehicleService.updateVehicle(vehicleId, updatedVehicle).subscribe({
                    next: () => {
                        Swal.fire({
                            title: '¡Vehículo actualizado!',
                            text: 'El vehículo ha sido actualizado correctamente',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2000
                        });
                        Object.assign(vehicle, updatedVehicle);
                        console.log('Vehículo después de la actualización:', vehicle);
                    },
                    error: (error) => {
                        console.error('Error al actualizar:', error);
                        Swal.fire({
                            title: 'Oops!',
                            text: 'Ha ocurrido un error al actualizar el vehículo',
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            }
        });
    } else {
        console.error('No se encontró el vehículo a editar');
    }
}


  eliminar(vehicleId: string) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehicleService.deleteVehicle(vehicleId).subscribe({
          next: () => {
            Swal.fire({
              title: "¡Vehículo eliminado!",
              text: "El vehículo ha sido eliminado correctamente",
              icon: "success",
              showConfirmButton: false,
              timer: 2000
            });
            this.vehicles = this.vehicles.filter(v => v._id !== vehicleId);
          },
          error: () => {
            Swal.fire({
              title: "Oops!",
              text: "Ha ocurrido un error al eliminar el vehículo",
              icon: "error",
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });
  }

  addNewVehicle() {
    Swal.fire({
      title: 'Agregar nuevo vehículo',
      html: `<div>
        <div>
          <label class="form-label">Marca</label>
          <input id="brand" type="text" class="form-control">
        </div>
        <div>
          <label class="form-label">Modelo</label>
          <input id="model" type="text" class="form-control">
        </div>
        <div>
          <label class="form-label">Descripción</label>
          <input id="description" type="text" class="form-control">
        </div>
        <div>
          <label class="form-label">Precio por día</label>
          <input id="pricePerDay" type="number" class="form-control">
        </div>
        <div>
          <label class="form-label">Año</label>
          <input id="year" type="number" class="form-control">
        </div>
        <div>
          <label class="form-label">URL de la imagen</label>
          <input id="image" type="text" class="form-control">
        </div>
      </div>`,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const brand = (document.getElementById('brand') as HTMLInputElement).value;
        const model = (document.getElementById('model') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;
        const pricePerDay = parseFloat((document.getElementById('pricePerDay') as HTMLInputElement).value);
        const year = parseInt((document.getElementById('year') as HTMLInputElement).value, 10);
        const image = (document.getElementById('image') as HTMLInputElement).value;
        return { brand, model, description, pricePerDay, year, image };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newVehicle = result.value;
        this.vehicleService.addVehicle(newVehicle).subscribe({
          next: (vehicle) => {
            this.vehicles.push(vehicle);
            Swal.fire({
              title: '¡Vehículo agregado!',
              text: 'El nuevo vehículo ha sido agregado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            });
          },
          error: (error) => {
            console.error('Error al agregar vehículo:', error);
            Swal.fire({
              title: 'Oops!',
              text: 'Ha ocurrido un error al agregar el vehículo',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });
  }

}
