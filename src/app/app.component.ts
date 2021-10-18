import { Component } from '@angular/core';
import test from 'src/assets/test.css';

console.log('typeof test: ', typeof test);
console.log(test);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular12-webpack5-inline-loader-repro';
}
