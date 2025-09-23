import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Product {
  id: number;
  codigo: string;
  producto: string;
  observ: string;
  peso: number;
  cant: number;
  porella: number;
  trach: number;
  tubica: number;
  flete: number;
  pesoTransp: number;
  ganancia: number;
  valVentaAprobado: number;
  valCompraUsdKg: number;
  valVentaUsdKg: number;
}

interface ComparativeData {
  cliente: string;
  tcUsd: string;
  fecha: string;
  vendedor: string;
  estado: string;
  usuario: string;
  products: Product[];
  subTotalMonetario: number;
  pesoTotalProveedor: number;
  fletePorProveedor: number;
}

@Component({
  selector: 'app-negociacion-proveedores',
  templateUrl: './negociacion-proveedores.component.html',
  styleUrls: ['./negociacion-proveedores.component.scss']
})
export class NegociacionProveedoresComponent {

  comparativeData: ComparativeData = {
    cliente: 'CL000137 - INMOBILIARIA & INVERSIONES KALEX S.A.C',
    tcUsd: '3.6940',
    fecha: '2025-09-22 11:29',
    vendedor: 'WEFRIQUEZ',
    estado: 'APROBADO',
    usuario: 'WEFRIQUEZ',
    products: [
      {
        id: 1,
        codigo: '148-000003',
        producto: 'Desinfectantes PROXITANE 15 12',
        observ: '48 HORAS',
        peso: 91.96,
        cant: 30,
        porella: 90.06,
        trach: 83.81,
        tubica: 87.46,
        flete: 0.00,
        pesoTransp: 2936.16,
        ganancia: 17.66,
        valVentaAprobado: 67.61,
        valCompraUsdKg: 8.71,
        valVentaUsdKg: 8.83
      },
      {
        id: 2,
        codigo: '147-000003',
        producto: 'Desinfectantes EXQUAT 50',
        observ: '',
        peso: 118.72,
        cant: 24,
        porella: 81.30,
        trach: 66.33,
        tubica: 89.72,
        flete: 90.09,
        pesoTransp: 2657.28,
        ganancia: 15.66,
        valVentaAprobado: 94.70,
        valCompraUsdKg: 9.74,
        valVentaUsdKg: 9.56
      }
    ],
    subTotalMonetario: 1953.39,
    pesoTotalProveedor: 2657.28,
    fletePorProveedor: 90.00
  };

  isLoading = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  regresar(): void {
    console.log('Regresando...');
    this.router.navigate(['/logistica/abastecimiento/list']);
  }

  descargar(): void {
    console.log('Descargando reporte...');
  }

  calcularTotales(): void {
    // Lógica para recalcular totales
    let subTotal = 0;
    let pesoTotal = 0;
    
    this.comparativeData.products.forEach(product => {
      subTotal += (product.cant * product.valVentaAprobado);
      pesoTotal += product.pesoTransp;
    });
    
    this.comparativeData.subTotalMonetario = subTotal;
    this.comparativeData.pesoTotalProveedor = pesoTotal;
  }

  editarProducto(product: Product): void {
    console.log('Editando producto:', product);
  }

  eliminarProducto(product: Product): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.comparativeData.products = this.comparativeData.products.filter(p => p.id !== product.id);
      this.calcularTotales();
    }
  }

}
