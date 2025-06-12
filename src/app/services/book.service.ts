// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /** ✅ Add book with PDF file (multipart/form-data) */
  addBookWithFile(book: Book, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('author', book.author);
    formData.append('year', book.year.toString());
    formData.append('file', file); // must match @RequestParam("file") in Spring Boot

  return this.http.post(this.apiUrl, formData);
  }

  /** ✅ Get all books */
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  /** ✅ Get book by ID */
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /** ✅ Add book (without file) */
  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /** ✅ Update book */
  updateBook(id: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /** ✅ Delete book */
  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /** 🔍 Search books (Backend must implement /search endpoint) */
  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search?q=${query}`)
      .pipe(catchError(this.handleError));
  }

  /** 📤 Export books (as CSV, PDF, etc.) */
  exportBooks(format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export?format=${format}`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /** 📥 Import books via file */
  importBooks(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData)
      .pipe(catchError(this.handleError));
  }

  /** ❗ Global error handler */
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
  downloadBookFile(bookId: string): Observable<Blob> {
  return this.http.get(`http://localhost:8080/api/books/${bookId}/download`, {
    responseType: 'blob'  // Important: Expect a binary file
  });
}



}
