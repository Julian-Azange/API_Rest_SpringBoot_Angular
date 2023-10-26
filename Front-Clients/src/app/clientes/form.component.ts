import { ClienteService } from './cliente.service';
import { Cliente } from './cliente';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  cliente: Cliente = {
    nombre: '',
    apellido: '',
    email: '',
    id: 0,
    createAt: '',
  };

  public titulo: string = 'Crear Cliente';
  errores: string[] = [];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe((cliente) => (this.cliente = cliente));
      }
    });
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      (cliente) => {
        console.log(cliente.nombre);
        this.router.navigate(['/clientes']);
        swal.fire(
          'Nuevo cliente',
          `El cliente ${cliente.nombre} ha sido creado con Éxito`,
          'success'
        );
      },
      (err) => {
        this.errores = err.error.errors as string[];
        console.log('Errores desde el backend: '+ err.status);
        console.log(err.error.errors);
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe((json) => {
      this.router.navigate(['/clientes']);
      swal.fire(
        'Cliente Actualizado',
        `${json.mensaje} : ${json.cliente.nombre}`,
        'success'
      );
    },
    (err) => {
      this.errores = err.error.errors as string[];
      console.log('Errores desde el backend: '+ err.status);
      console.log(err.error.errors);
    });
  }
}
