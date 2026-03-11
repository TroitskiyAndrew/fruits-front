import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, retryWhen, scan, mergeMap, timer, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {  }
  async getCities(): Promise<any[]> {
    const url = `${environment.backendUrl}/cities`;
    return this.http
      .get<any[]>(url)
      .toPromise()
      .then(res => res || [])
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return []
      })
  }
  async getPlaces(): Promise<any[]> {
    const url = `${environment.backendUrl}/places`;
    return this.http
      .get<any[]>(url)
      .toPromise()
      .then(res => res || [])
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return []
      })
  }
  async getUser(userId: number): Promise<any | null> {
    const url = `${environment.backendUrl}/users/${userId}`;
    return this.http
      .get<any>(url)
      .toPromise()
      .then(res => res || null)
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      })
  }
  async byTickets(formData: FormData): Promise<any[]> {
    const url = `${environment.backendUrl}/tickets`;
    return this.http
      .post<any[]>(url, formData)
      .toPromise()
      .then(res => res || [])
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return []
      });
  }
  async getTickets(): Promise<any[]> {
    const url = `${environment.backendUrl}/tickets`;
    return this.http
      .get<any[]>(url)
      .toPromise()
      .then(res => res || [])
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return []
      })
  }
  async getTicket(id: string): Promise<any | null> {
    const url = `${environment.backendUrl}/ticket/${id}`;
    return this.http
      .get<any>(url)
      .toPromise()
      .then(res => res || null)
      .catch(() => {
        return null
      });
  }
  async getTicketsByBooking(bookingId: string): Promise<any[]> {
    const url = `${environment.backendUrl}/booking/${bookingId}`;
    return this.http
      .get<any>(url)
      .toPromise()
      .then(res => res || [])
      .catch(() => {
        return []
      });
  }

  async changeTicketStatus(ticketId: string, inside: boolean): Promise<any | null> {
    const url = `${environment.backendUrl}/ticket`;
    return this.http
      .put<any>(url, {ticketId, inside})
      .toPromise()
      .then(res => res || null)
      .catch(() => {
        return null
      });
  }
  async getEvent(eventId: string): Promise<any | null> {
    const url = `${environment.backendUrl}/event/${eventId}`;
    return this.http
      .get<any>(url)
      .toPromise()
      .then(res => res || null)
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      });
  }
  async getSales(eventId: string): Promise<any | null> {
    const url = `${environment.backendUrl}/sales/${eventId}`;
    return this.http
      .get<any>(url)
      .toPromise()
      .then(res => res || [])
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return [null]
      });
  }
  async saveVisit(city: string, event: string): Promise<any | null> {
    const url = `${environment.backendUrl}/cities`;
    return this.http
      .post<any>(url, {city, event})
      .toPromise()
      .then(res => res || null).catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      });
  }
  async saveSource(source: string): Promise<any | null> {
    const url = `${environment.backendUrl}/users`;
    return this.http
      .post<any>(url, {source})
      .toPromise()
      .then(res => res || null).catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      });
  }

  async savePath(pathPoint: string): Promise<any | null> {
    const url = `${environment.backendUrl}/path`;
    return this.http
      .post<any>(url, {pathPoint})
      .toPromise()
      .then(res => res || null).catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      });
  }

  async sellTickets(body: any): Promise<any[]> {
    const url = `${environment.backendUrl}/sell`;
    return this.http
      .post<any[]>(url, body)
      .toPromise()
      .then(res => res || []).catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return []
      });
  }

    findUsers(query: string): Observable<any[]> {
    const url = `${environment.backendUrl}/find/${query}`;
    return this.http
      .get<any>(url).pipe(
      retryWhen(errors =>
        errors.pipe(
          scan((retryCount, error: HttpErrorResponse) => {
            if (error.status !== 429 || retryCount >= 3) {
              throw error;
            }
            return retryCount + 1;
          }, 0),
          mergeMap(retryCount =>
            timer(500 * Math.pow(2, retryCount)) // 500ms → 1000ms → 2000ms
          )
        )
      ),
      catchError(err => {
        console.error('Search error:', err);
        return throwError(() => err);
      })
    );
  }
}
