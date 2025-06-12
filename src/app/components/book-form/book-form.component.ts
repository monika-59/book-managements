// src/app/components/book-form/book-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { title } from 'node:process';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  maxYear: number = new Date().getFullYear() + 10;
  bookForm: FormGroup;
  isEditMode: boolean = false;
  bookId: string | null = null;
  loading: boolean = false;
  error: string = '';
  selectedFile: File | null = null;
  fileError = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookForm = this.createForm();
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.bookId;

    if (this.isEditMode && this.bookId) {
      this.loadBook(this.bookId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      author: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      year: ['', [
        Validators.required, 
        Validators.min(1000), 
        Validators.max(new Date().getFullYear() + 10)
      ]]
    });
  }

  loadBook(id: string): void {
    this.loading = true;
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          year: book.year
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load book details. Please try again.';
        this.loading = false;
        console.error('Error loading book:', error);
      }
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileError = '';
    } else {
      this.selectedFile = null;
      this.fileError = 'Please select a file.';
    }
  }

  onSubmit(): void {
    // console.log(this.bookForm.value);
    if (this.bookForm.valid) {
      this.loading = true;
      this.error = '';
      
      const bookData: Book = {
        title: this.bookForm.value.title.trim(),
        author: this.bookForm.value.author.trim(),
        year: parseInt(this.bookForm.value.year)
      };

      if (this.isEditMode && this.bookId) {
        this.updateBook(this.bookId, bookData);
      } else {
        this.addBook(bookData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  addBook(book: Book): void {
  if (!this.selectedFile) {
    this.fileError = 'Please select a PDF file.';
    this.loading = false;
    return;
  }

  const formData = new FormData();
  formData.append('title', book.title);
  formData.append('author', book.author);
  formData.append('year', book.year.toString());
  formData.append('file', this.selectedFile);

  this.bookService.importBooks(formData).subscribe({
    next: () => {
      this.successMessage = 'Book with PDF added successfully!';
      this.loading = false;
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    },
    error: (error) => {
      this.error = 'Failed to add book. Please try again.';
      this.loading = false;
      console.error('Error adding book:', error);
    }
  });
}


  updateBook(id: string, book: Book): void {
    this.bookService.updateBook(id, book).subscribe({
      next: (response) => {
        this.successMessage = 'Book updated successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error) => {
        this.error = 'Failed to update book. Please try again.';
        this.loading = false;
        console.error('Error updating book:', error);
      }
    });
  }
  downloadBookFile(book:Book): void {
    if (!this.bookId) return;

    this.bookService.downloadBookFile(this.bookId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `book_${this.bookId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.error = 'Failed to download file.';
        console.error('Error downloading file:', error);
      }
    });
  }


  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.bookForm.controls).forEach(key => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.bookForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} is too short`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} is too long`;
      }
      if (field.errors['min']) {
        return `Year must be at least 1000`;
      }
      if (field.errors['max']) {
      return `Year cannot be more than ${this.maxYear}`;
    }
    }
    return '';
  }

  getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'title': 'title',
      'author': 'author',
      'year': 'year'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }
}