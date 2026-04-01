import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, retryWhen, scan, mergeMap, timer, catchError, throwError } from 'rxjs';
import { Product, IPayment, IUser, IOrder, PaymentMethod, INewOrderInfo, IPayOptions, IConfig } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private externalHttpClient: HttpClient;

  constructor(private http: HttpClient, private httpBackend: HttpBackend) {
    this.externalHttpClient = new HttpClient(this.httpBackend);
  }

  async getAllProducts(): Promise<Product[]> {
    const url = `${environment.backendUrl}/all-products`;
    return this.http
      .post<Product[]>(url, { query: {} })
      .toPromise()
      .then(res => res || [])
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return []
      })
  }

  async getUser(userId: number | string): Promise<IUser | null> {
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


  async saveSource(source: string): Promise<any | null> {
    const url = `${environment.backendUrl}/source`;
    return this.http
      .post<any>(url, { source })
      .toPromise()
      .then(res => res || null).catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      });
  }

  async savePath(pathPoint: string): Promise<any | null> {
    const url = `${environment.backendUrl}/path`;
    return this.http
      .post<any>(url, { pathPoint })
      .toPromise()
      .then(res => res || null).catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      });
  }

  async updateUser(user: {id: string} & Partial<IUser>): Promise<boolean> {
    const url = `${environment.backendUrl}/users/${user.id}`;
    return this.http
      .put<any>(url, user)
      .toPromise()
      .then(res => res || false)
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return false
      })
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

  async createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    const url = `${environment.backendUrl}/products`;
    return this.http
      .post<Product>(url, { product })
      .toPromise()
      .then(res => res || null)
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      })
  }
  async updateProduct(product: Product): Promise<Product | null> {
    const url = `${environment.backendUrl}/products/${product.id}`;
    return this.http
      .put<Product | null>(url, { product })
      .toPromise()
      .then(res => res || null)
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      })
  }
  async createOrder(order: IOrder, method: PaymentMethod): Promise<INewOrderInfo | null> {
    const url = `${environment.backendUrl}/orders`;
    return this.http
      .post<INewOrderInfo>(url, { order, method })
      .toPromise()
      .then(res => res || null)
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      })
  }

  uploadPhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.externalHttpClient.post(environment.uploadImageUrl, formData).toPromise().then((response: any) => response.data.url).catch((error) => {
      console.log(error);
      return '';
    })
  }

  pay(options: IPayOptions): Promise<boolean> {
    const url = `${environment.backendUrl}/pay`;
    return this.http
      .post<boolean>(url, options)
      .toPromise()
      .then(res => res || false)
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return false
      })
  }

  getConfig(): Promise<IConfig | null> {
    const url = `${environment.backendUrl}/config`;
    return this.http
      .get<IConfig>(url)
      .toPromise()
      .then(res => res || null)
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      })
  }
  getPayment(id: string): Promise<IPayment | null> {
    const url = `${environment.backendUrl}/payments/${id}`;
    return this.http
      .get<IPayment>(url)
      .toPromise()
      .then(res => res || null)
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      })
  }
  getOrder(id: string): Promise<IOrder | null> {
    const url = `${environment.backendUrl}/orders/${id}`;
    return this.http
      .get<IOrder>(url)
      .toPromise()
      .then(res => res || null)
      .catch(() => {
        alert('Что-то пошло не так. Напишите в чат с ботом. Напишите в чат с ботом, мы разберемся');
        return null
      })
  }
}
