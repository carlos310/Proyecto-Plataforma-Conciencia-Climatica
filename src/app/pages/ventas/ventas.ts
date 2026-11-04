import { Component } from '@angular/core';
import { FontSize } from "../../components/font-size/font-size";



@Component({
  selector: 'app-ventas',
  standalone:true,
  imports: [FontSize],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas {}
