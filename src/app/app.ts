import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageEditorComponent } from "./image-editor/image-editor";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ImageEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ig-trip-cover');
}
