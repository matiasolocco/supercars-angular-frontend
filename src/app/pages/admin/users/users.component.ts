import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { DivisaPipe } from '../../../pipes/divisa.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [FormatDatePipe, DivisaPipe]
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response: User[]) => {
        this.users = response as User[];
      },
      error: (error) => {
        console.error('Error al cargar los usuarios', error);
      }
    });
  }

  eliminar(userId: string) {
    console.log('Eliminar usuario:', userId);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Usuario eliminado!',
              text: 'El usuario ha sido eliminado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            });

            this.users = this.users.filter(user => user.id !== userId);
          },
          error: () => {
            Swal.fire({
              title: 'Oops!',
              text: 'Ha ocurrido un error',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });
  }

  editar(userId: string) {
    console.log('Editar usuario:', userId); 
    const usuarioEditar: User | undefined = this.users.find(user => user.id === userId);
    if (usuarioEditar) {
      console.log('Usuario encontrado para editar:', usuarioEditar); 
      Swal.fire({
        title: `Editar usuario ${usuarioEditar.name}`,
        html: `<div>
          <div>
            <label class="form-label">Nombre</label>
            <input id="userName" type="text" class="form-control" value="${usuarioEditar.name}">
          </div>
          <div>
            <label class="form-label">Correo electrónico</label>
            <input id="userEmail" type="email" class="form-control" value="${usuarioEditar.email}">
          </div>
          <div>
            <label class="form-label">Rol</label>
            <input id="userRole" type="text" class="form-control" value="${usuarioEditar.role}">
          </div>
        </div>`,
        showCancelButton: true,
        confirmButtonText: 'Guardar cambios',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const name = (document.getElementById('userName') as HTMLInputElement).value;
          const email = (document.getElementById('userEmail') as HTMLInputElement).value;
          const role = (document.getElementById('userRole') as HTMLInputElement).value;
          return { name, email, role };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { name, email, role } = result.value;
          this.userService.updateUser(userId, { name, email, role }).subscribe({
            next: () => {
              Swal.fire({
                title: '¡Usuario actualizado!',
                text: 'El usuario ha sido actualizado correctamente',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
              });
              usuarioEditar.name = name;
              usuarioEditar.email = email;
              usuarioEditar.role = role;
            },
            error: () => {
              Swal.fire({
                title: 'Oops!',
                text: 'Ha ocurrido un error al actualizar el usuario',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
        }
      });
    } else {
      console.error('No se encontró el usuario a editar');
    }
  }
}
