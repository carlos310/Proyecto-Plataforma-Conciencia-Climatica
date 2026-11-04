import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../domain/producto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos-dashboard.html',
  styleUrls: ['./productos-dashboard.css'],
})
export class ProductosDashboard implements OnInit {
  productos: Producto[] = [];

  async ngOnInit() {
    try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/productos/productos");
      if (!res.ok) throw new Error("Error obteniendo productos");
      this.productos = await res.json();
      console.log("Productos cargados:", this.productos);
    }
  } catch (error) {
    console.error("Error cargando productos", error);
  }
  }
}
