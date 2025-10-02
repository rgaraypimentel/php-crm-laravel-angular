import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProformasService } from 'src/app/modules/proformas/service/proformas.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { VentasService } from '../../service/ventas.service';

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrls: ['./create-factura.component.scss']
})
export class CreateFacturaComponent {

  isBien = true;

  TODAY: string = 'Y/m/d';
  isLoading$: any;
  imagen_previzualiza: any = '';

  facturaForm: FormGroup;
  productForm: FormGroup;
  isLoading = false;

  @ViewChild("discount") something: ElementRef;
  @ViewChild('productModal') productModal: any;
  payment_file: any;

  constructor(
    public modalService: NgbModal,
    public proformaService: ProformasService,
    public ventasService: VentasService,
    public toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.facturaForm = this.fb.group({
      tipoDoc: ['01', [Validators.required]],
      tipoOperacion: ['0101', [Validators.required]],
      serie: ['F001', [Validators.required]],
      correlativo: ['1', [Validators.required]],
      fechaEmision: ['2023-07-25T00:00:00-05:00', [Validators.required]],
      moneda: ['PEN', [Validators.required]],
      tipoPago: ['Contado', [Validators.required]],
      clientTipoDoc: ['6', [Validators.required]],
      clientNumDoc: ['', [Validators.required]],
      clientRznSocial: ['', [Validators.required]],
      details: this.fb.array([])
    });
    // Formulario para el modal de agregar productos
    this.productForm = this.fb.group({
      productoTipo: ['bien', Validators.required],
      codProducto: ['', [Validators.required]],
      unidad: ['NIU', [Validators.required]], // Valor predeterminado
      descripcion: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      mtoValorUnitario: [0, [Validators.required]],
      porcentajeIgv: [18, [Validators.required]] // Porcentaje de IGV, predeterminado a 18%
    });
  }

  ngOnInit(): void {
    this.isLoading$ = this.proformaService.isLoading$;
    this.proformaService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.TODAY = resp.today;
      this.isLoadingProcess();
    });
    this.facturaForm.get('tipoDoc')?.valueChanges.subscribe(value => {
      // Si tipoDoc es '03' (Boleta), cambiamos la serie a 'B001'
      if (value === '03') {
        this.facturaForm.patchValue({
          serie: 'B001'
        });
      } else {
        // Si no es Boleta, se restablece la serie a 'F001' (Factura)
        this.facturaForm.patchValue({
          serie: 'F001'
        });
      }
    });
  }
  onTipoProductoChange(tipo: string) {
    this.isBien = tipo === 'bien';  // Cambiar la visibilidad de Unidad
    if (!this.isBien) {
      this.productForm.get('unidad')?.setValue('NIU'); // Restablecer la unidad a 'Unidades' si es servicio
    }
  }

  isLoadingProcess() {
    this.proformaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.proformaService.isLoadingSubject.next(false);
    }, 50);
  }

  // Getter para acceder al FormArray de productos
  get detalles(): FormArray {
    return this.facturaForm.get('details') as FormArray;
  }

  // Abrir el modal para agregar un producto
  openModal(productIndex?: number) {
    if (productIndex !== undefined) {
      const product = this.detalles.at(productIndex).value;
      // Si hay un producto seleccionado, precargamos los valores del producto en el modal
      this.productForm.patchValue({
        codProducto: product.codProducto,
        unidad: product.unidad,
        descripcion: product.descripcion,
        cantidad: product.cantidad,
        mtoValorUnitario: product.mtoValorUnitario,
        porcentajeIgv: product.porcentajeIgv
      });
    } else {
      this.productForm.reset();
    }

    this.modalService.open(this.productModal);
  }

  // Método para agregar el producto al formulario
  agregarProducto(modal: any): void {
    if (this.productForm.valid) {
      const newProduct = this.productForm.value;

      // Calcular los valores relacionados con el producto
      const mtoValorVenta = newProduct.mtoValorUnitario * newProduct.cantidad;
      const mtoBaseIgv = newProduct.mtoValorUnitario * newProduct.cantidad;
      const igv = (mtoBaseIgv * newProduct.porcentajeIgv) / 100;
      const totalImpuestos = igv;
      const mtoPrecioUnitario = newProduct.mtoValorUnitario + (newProduct.mtoValorUnitario * newProduct.porcentajeIgv) / 100;
      // Si estamos editando un producto, lo actualizamos
      const productIndex = this.productForm.value.index;
      if (productIndex !== undefined) {
        // Editamos el producto existente en el array
        this.detalles.at(productIndex).patchValue({
          codProducto: newProduct.codProducto,
          unidad: newProduct.unidad,
          descripcion: newProduct.descripcion,
          cantidad: newProduct.cantidad,
          mtoValorUnitario: newProduct.mtoValorUnitario,
          mtoValorVenta,
          mtoBaseIgv,
          porcentajeIgv: newProduct.porcentajeIgv,
          igv,
          totalImpuestos,
          mtoPrecioUnitario
        });
      } else {
        this.detalles.push(this.fb.group({
          tipAfeIgv: [10],
          codProducto: [newProduct.codProducto],
          unidad: [newProduct.unidad],
          descripcion: [newProduct.descripcion],
          cantidad: [newProduct.cantidad],
          mtoValorUnitario: [newProduct.mtoValorUnitario],
          mtoValorVenta: [mtoValorVenta],
          mtoBaseIgv: [mtoBaseIgv],
          porcentajeIgv: [newProduct.porcentajeIgv],
          igv: [igv],
          totalImpuestos: [totalImpuestos],
          mtoPrecioUnitario: [mtoPrecioUnitario]
        }));
      }

      // Cerrar el modal
      modal.close();
      this.productForm.reset();
    }
  }

  // Método para eliminar un producto del formulario
  eliminarProducto(index: number): void {
    this.detalles.removeAt(index);
  }

  // Método para armar el JSON y enviarlo al backend
  enviarFactura() {
    if (this.facturaForm.valid) {
      this.isLoading = true;

      const facturaData = {
        tipoDoc: this.facturaForm.value.tipoDoc,
        tipoOperacion: this.facturaForm.value.tipoOperacion,
        serie: this.facturaForm.value.serie,
        correlativo: this.facturaForm.value.correlativo,
        fechaEmision: this.facturaForm.value.fechaEmision,
        formaPago: {
          moneda: this.facturaForm.value.moneda,
          tipo: this.facturaForm.value.tipoPago,
        },
        tipoMoneda: this.facturaForm.value.moneda,  // Esto lo mantenemos fijo como "PEN"
        company: {
          ruc: 20606096225,
          razonSocial: "Qallpa Tics",
          nombreComercial: "",
          address: {
            ubigueo: "150101",
            departamento: "LIMA",
            provincia: "LIMA",
            distrito: "LIMA",
            urbanizacion: "-",
            direccion: "CAL.EDUARDO BELLO NRO. 305 DPTO. 202 URB. SANTA CATALINA LIMA - LIMA - LA VICTORIA",
            codLocal: "0000"
          }
        },
        client: {
          tipoDoc: this.facturaForm.value.clientTipoDoc,
          numDoc: this.facturaForm.value.clientNumDoc,
          rznSocial: this.facturaForm.value.clientRznSocial
        },
        details: this.facturaForm.value.details
      };

      console.log(facturaData);
      this.ventasService.createFactura(facturaData).subscribe(
        (response) => {
          console.log('Factura enviada con éxito', response);

          // Verificamos la respuesta de SUNAT
          if (response.sunatResponse.success) {
            // Si la respuesta de SUNAT es exitosa, mostramos el mensaje de "La Factura ha sido aceptada"
            this.toast.success("Éxito", response.sunatResponse.cdrResponse.description);
          } else {
            // Si la respuesta de SUNAT no es exitosa, mostramos el mensaje de error proporcionado
            this.toast.error("Error", response.sunatResponse.error.message);
          }
        },
        (error) => {
          console.error('Error al enviar la factura', error);
          this.toast.error("Validación", "No se pudo enviar la factura");
        },
        () => {
          this.isLoading = false;
        }
      );

    } else {
      console.log(this.facturaForm)
      console.log('Formulario inválido');
      this.toast.error("Validación", "Formulario inválido");
    }
  }

  calcularValores(index: number): void {
    const producto = this.detalles.at(index);
    const cantidad = producto.value.cantidad;
    const mtoValorUnitario = producto.value.mtoValorUnitario;
    const porcentajeIgv = producto.value.porcentajeIgv;

    // Calcular mtoValorVenta y mtoBaseIgv
    const mtoValorVenta = mtoValorUnitario * cantidad;
    const mtoBaseIgv = mtoValorUnitario * cantidad;

    // Calcular IGV y Total Impuestos
    const igv = (mtoBaseIgv * porcentajeIgv) / 100;
    const totalImpuestos = igv;

    // Calcular mtoPrecioUnitario
    const mtoPrecioUnitario = mtoValorUnitario + (mtoValorUnitario * porcentajeIgv) / 100;

    // Asignar los valores calculados al producto
    producto.patchValue({
      mtoValorVenta,
      mtoBaseIgv,
      igv,
      totalImpuestos,
      mtoPrecioUnitario
    });
  }
}
