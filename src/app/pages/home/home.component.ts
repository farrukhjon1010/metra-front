import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastComponent} from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
