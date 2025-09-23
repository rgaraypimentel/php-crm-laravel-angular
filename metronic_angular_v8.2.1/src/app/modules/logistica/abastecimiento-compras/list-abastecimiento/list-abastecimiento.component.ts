import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface PurchaseProduct {
  id: number;
  numeroProforma: string;
  datosCliente: {
    nombre: string;
    tipo: string;
  };
  segmentoCliente: string;
  total: number;
  estadoProforma: string;
  estadoPago: string;
  adeudo: number;
  pagado: number;
  asesor: string;
  fechaRegistro: string;
  productos: ProductDetail[];
}

interface ProductDetail {
  codigo: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'app-list-abastecimiento',
  templateUrl: './list-abastecimiento.component.html',
  styleUrls: ['./list-abastecimiento.component.scss']
})
export class ListAbastecimientoComponent {
  purchaseProducts: PurchaseProduct[] = [
    {
      id: 1,
      numeroProforma: '3012',
      datosCliente: {
        nombre: 'Aceros del Norte SAC',
        tipo: 'EMPRESA'
      },
      segmentoCliente: 'Cliente Final',
      total: 15420.00,
      estadoProforma: 'Cotización',
      estadoPago: 'Pendiente',
      adeudo: 15420.00,
      pagado: 0.00,
      asesor: 'Super Admin',
      fechaRegistro: '2025-09-16 08:20:PM',
      productos: [
        { codigo: '148-000003', nombre: 'TUBO CUADRADO LAC ASIN GR. A 100 MM X 4', cantidad: 30, precio: 90.06 },
        { codigo: '147-000003', nombre: 'TUBO RECTANGULAR LAC ASIN GR. A 100 MM X', cantidad: 24, precio: 81.30 }
      ]
    },
    {
      id: 2,
      numeroProforma: '3011',
      datosCliente: {
        nombre: 'Constructora Martinez SRL',
        tipo: 'EMPRESA'
      },
      segmentoCliente: 'Cliente Mayorista Tipo B',
      total: 9220.00,
      estadoProforma: 'Cotización',
      estadoPago: 'Pendiente',
      adeudo: 9220.00,
      pagado: 0.00,
      asesor: 'Super Admin',
      fechaRegistro: '2025-05-28 04:28:PM',
      productos: [
        { codigo: '145-000001', nombre: 'PLANCHA DE ACERO LAC A-36 6MM', cantidad: 15, precio: 245.50 },
        { codigo: '146-000002', nombre: 'PERFIL ANGULAR LAC 2" X 1/4"', cantidad: 50, precio: 32.80 }
      ]
    },
    {
      id: 3,
      numeroProforma: '3010',
      datosCliente: {
        nombre: 'Laura Mendoza Construction',
        tipo: 'PERSONA'
      },
      segmentoCliente: 'Cliente Final',
      total: 699.00,
      estadoProforma: 'Cotización',
      estadoPago: 'Pendiente',
      adeudo: 699.00,
      pagado: 0.00,
      asesor: 'Super Admin',
      fechaRegistro: '2025-05-28 04:00:PM',
      productos: [
        { codigo: '149-000004', nombre: 'VARILLA CORRUGADA 1/2" x 12M', cantidad: 20, precio: 34.95 }
      ]
    },
    {
      id: 4,
      numeroProforma: '3009',
      datosCliente: {
        nombre: 'Inversiones Metalúrgicas SAC',
        tipo: 'EMPRESA'
      },
      segmentoCliente: 'Cliente Gubernamental',
      total: 1150.00,
      estadoProforma: 'Cotización',
      estadoPago: 'Pendiente',
      adeudo: 1150.00,
      pagado: 0.00,
      asesor: 'Super Admin',
      fechaRegistro: '2025-05-28 03:53:PM',
      productos: [
        { codigo: '150-000005', nombre: 'ELECTRODO 6011 3/32"', cantidad: 100, precio: 11.50 }
      ]
    },
    {
      id: 5,
      numeroProforma: '3008',
      datosCliente: {
        nombre: 'Estructuras del Perú SRL',
        tipo: 'EMPRESA'
      },
      segmentoCliente: 'Cliente Mayorista Tipo B',
      total: 6414.10,
      estadoProforma: 'Cotización',
      estadoPago: 'Parcial',
      adeudo: 3527.76,
      pagado: 2886.35,
      asesor: 'Flor Candia',
      fechaRegistro: '2025-12-17 09:31:AM',
      productos: [
        { codigo: '151-000006', nombre: 'CANAL U LAC 100MM X 50MM X 3MM', cantidad: 80, precio: 45.20 },
        { codigo: '152-000007', nombre: 'PERFIL T LAC 2" X 1/4"', cantidad: 40, precio: 62.85 }
      ]
    }
  ];

  search: string = '';
  isLoading = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  buscarProductos(): void {
    console.log('Buscando productos:', this.search);
    // Implementar lógica de búsqueda
  }

  resetBusqueda(): void {
    this.search = '';
    console.log('Reseteando búsqueda');
  }

  editarProforma(product: PurchaseProduct): void {
    console.log('Editando proforma:', product.numeroProforma);
    // Navegar a edición
  }

  eliminarProforma(product: PurchaseProduct): void {
    if (confirm('¿Está seguro de eliminar esta proforma?')) {
      this.purchaseProducts = this.purchaseProducts.filter(p => p.id !== product.id);
      console.log('Proforma eliminada:', product.numeroProforma);
    }
  }

  verCuadroComparativo(product: PurchaseProduct): void {
    console.log('Ver cuadro comparativo para:', product.numeroProforma);
    this.router.navigate(['/logistica/abastecimiento/list-costos']);
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'cotización':
        return 'badge-light-warning';
      case 'aprobado':
        return 'badge-light-success';
      case 'rechazado':
        return 'badge-light-danger';
      default:
        return 'badge-light-primary';
    }
  }

  getPagoBadgeClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'total':
        return 'badge-success';
      case 'parcial':
        return 'badge-warning';
      case 'pendiente':
        return 'badge-light-danger';
      default:
        return 'badge-secondary';
    }
  }
}
