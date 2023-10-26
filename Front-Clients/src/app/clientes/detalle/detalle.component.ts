import { ModalService } from './modal.service';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from './../cliente.service';
import { Cliente } from './../cliente';
import { Component, Input, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
export class DetalleComponent implements OnInit {
  @Input() cliente!: Cliente;
  titulo: string = 'Detalle del cliente';
  fotoSeleccionada!: File;
  nombreFoto = "Seleccionar foto";
  progreso: number = 0;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    public modalService: ModalService,
  ) {}

  ngOnInit(): void {
    /*
    this.activatedRoute.paramMap.subscribe((params) => {
      let id: number = +params.get('id')!;
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }
    });*/
  }

  seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    this.nombreFoto = this.fotoSeleccionada.name;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') <0){
      swal.fire(
        `Error al seleccionar imager: `,
        'El archivo debe ser del tipo imagen',
        'error'
      );
      this.fotoSeleccionada = null!;
    }
  }

  subirFoto() {
    if(!this.fotoSeleccionada){
      swal.fire(
        `Error al subir: `,
        'Debe Seleccionar una foto',
        'error'
      );
    }else{
    this.clienteService
      .subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe((event) => {
        if(event?.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/ event.total!)*100)
        }else if(event.type === HttpEventType.Response ){
          let response:any = event.body;
          this.cliente = response.cliente as Cliente;

          swal.fire(
            `Foto Cargada: ${this.cliente.foto}`,
            `La foto ha sido subida con Éxito! ${response.mensaje}`,'success'
          );
        }

        //this.cliente = cliente;

      });
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null!;
    this.progreso = 0;
  }

}
