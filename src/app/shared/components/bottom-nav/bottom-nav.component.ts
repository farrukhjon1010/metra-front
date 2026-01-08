import { Component } from '@angular/core';
import {RouterLink, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  styleUrls: ['./bottom-nav.component.css']
})
export class BottomNavComponent {}
