import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import { isHeic, heicTo } from "heic-to"

@Component({
    selector: 'app-image-editor',
    templateUrl: './image-editor.html',
    styleUrls: ['./image-editor.scss'],
    imports: [FormsModule, CommonModule]
})
export class ImageEditorComponent {
    status$ = signal('');
    imageSrc$ = signal<null | string>(null);
    imgResult$ = signal<null | string>(null);
    overlayText: string = 'Your Text Here';
    beforeAfterText: string = '☀️';
    fontSize$ = signal(96);
    bgOpacity = signal(0.65);
    exporting$ = signal(false);

    @ViewChild('canvasContainer') canvasContainer!: ElementRef;

    async onFileSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];

        if (!file) {
            return;
        }

        if (await isHeic(file)) {
            this.status$.set('Converting HEIC to JPEG...');
            const jpeg = await heicTo({
                blob: file,
                type: "image/jpeg",
                quality: 0.85
            })
            this.imageSrc$.set(URL.createObjectURL(jpeg));
            this.status$.set('Image loaded.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => this.imageSrc$.set(reader.result as string);
        reader.readAsDataURL(file);
        this.status$.set('Image loaded.');
    }

    downloadImage(): void {
        this.exporting$.set(true);

        html2canvas(this.canvasContainer.nativeElement, {
            width: 1080,
            height: 1920
        }).then(canvas => {
            const imageData = canvas.toDataURL('image/jpeg');
            this.imgResult$.set(imageData);
            this.exporting$.set(false);
        });
    }
}
