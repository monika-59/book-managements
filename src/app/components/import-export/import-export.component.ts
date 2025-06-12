// // src/app/components/import-export/import-export.component.ts
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { BookService } from '../../services/book.service';

// @Component({
//   selector: 'app-import-export',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './import-export.component.html',
//   styleUrls: ['./import-export.component.css']
// })
// export class ImportExportComponent {
//   loading: boolean = false;
//   error: string = '';
//   successMessage: string = '';
//   selectedFile: File | null = null;
//   dragOver: boolean = false;

//   constructor(private bookService: BookService) { }

//   // Export Functions
//   exportToCSV(): void {
//     this.loading = true;
//     this.clearMessages();

//     this.bookService.exportBooks('csv').subscribe({
//       next: (blob) => {
//         this.downloadFile(blob, 'books.csv', 'text/csv');
//         this.successMessage = 'Books exported to CSV successfully!';
//         this.loading = false;
//         setTimeout(() => this.successMessage = '', 3000);
//       },
//       error: (error) => {
//         this.error = 'Failed to export books to CSV. Please try again.';
//         this.loading = false;
//         console.error('Export error:', error);
//         setTimeout(() => this.error = '', 3000);
//       }
//     });
//   }

//   exportToTXT(): void {
//     this.loading = true;
//     this.clearMessages();

//     this.bookService.exportBooks('txt').subscribe({
//       next: (blob) => {
//         this.downloadFile(blob, 'books.txt', 'text/plain');
//         this.successMessage = 'Books exported to TXT successfully!';
//         this.loading = false;
//         setTimeout(() => this.successMessage = '', 3000);
//       },
//       error: (error) => {
//         this.error = 'Failed to export books to TXT. Please try again.';
//         this.loading = false;
//         console.error('Export error:', error);
//         setTimeout(() => this.error = '', 3000);
//       }
//     });
//   }

//   private downloadFile(blob: Blob, filename: string, mimeType: string): void {
//     const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   }

//   // Import Functions
//   onFileSelected(event: any): void {
//     const file = event.target.files[0];
//     this.handleFileSelection(file);
//   }

//   onDragOver(event: DragEvent): void {
//     event.preventDefault();
//     this.dragOver = true;
//   }

//   onDragLeave(event: DragEvent): void {
//     event.preventDefault();
//     this.dragOver = false;
//   }

//   onDrop(event: DragEvent): void {
//     event.preventDefault();
//     this.dragOver = false;
    
//     const files = event.dataTransfer?.files;
//     if (files && files.length > 0) {
//       this.handleFileSelection(files[0]);
//     }
//   }

//   private handleFileSelection(file: File): void {
//     if (!file) return;

//     const allowedTypes = ['text/csv', 'text/plain', '.csv', '.txt'];
//     const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
//     if (!allowedTypes.includes(file.type) && !allowedTypes.includes(fileExtension)) {
//       this.error = 'Please select a valid CSV or TXT file.';
//       setTimeout(() => this.error = '', 3000);
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) { // 5MB limit
//       this.error = 'File size must be less than 5MB.';
//       setTimeout(() => this.error = '', 3000);
//       return;
//     }

//     this.selectedFile = file;
//     this.clearMessages();
//   }

//   importBooks(): void {
//     if (!this.selectedFile) {
//       this.error = 'Please select a file first.';
//       setTimeout(() => this.error = '', 3000);
//       return;
//     }

//     this.loading = true;
//     this.clearMessages();

//     this.bookService.importBooks(this.selectedFile).subscribe({
//       next: (response) => {
//         this.successMessage = `Books imported successfully! ${response.count || 'Multiple'} books added.`;
//         this.loading = false;
//         this.selectedFile = null;
//         // Reset file input
//         const fileInput = document.getElementById('fileInput') as HTMLInputElement;
//         if (fileInput) fileInput.value = '';
//         setTimeout(() => this.successMessage = '', 5000);
//       },
//       error: (error) => {
//         this.error = 'Failed to import books. Please check file format and try again.';
//         this.loading = false;
//         console.error('Import error:', error);
//         setTimeout(() => this.error = '', 3000);
//       }
//     });
//   }

//   removeSelectedFile(): void {
//     this.selectedFile = null;
//     const fileInput = document.getElementById('fileInput') as HTMLInputElement;
//     if (fileInput) fileInput.value = '';
//     this.clearMessages();
//   }

//   clearMessages(): void {
//     this.error = '';
//     this.successMessage = '';
//   }

//   formatFileSize(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }
// }