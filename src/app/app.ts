import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { FontSize } from './components/font-size/font-size';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer,FontSize, RouterModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('aquanova');
  constructor (private router:Router){
  }
}
