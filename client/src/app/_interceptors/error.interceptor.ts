import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router,private toastr: ToastrService){

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if(error){
          switch(error.status)
          {
            case 400:
              if(error.error.errors)
              {
                const modalStateErros = [];
                for(const key in error.error.errors){
                  if(error.error.errors[key]){
                    modalStateErros.push(error.error.errors[key])
                  }
                }
                throw modalStateErros.flat();
              }else if(typeof(error.error)=== 'object')
              {
                this.toastr.error(error.statusText,error.status);
              }else{
                this.toastr.error(error.error,error.status)
              }
                break;
              case 401:
                this.toastr.error(error.statusText,error.status);
                break;
              case 404:
                this.router.navigateByUrl('/not-found');
                break;
              case 500:
                const navigationExtras: NavigationExtras = {state: {error: error.error}};
                this.router.navigateByUrl('/server-error',navigationExtras);
                break;
              default:
                this.toastr.error('Something unexpected went wrong');
                console.log(error);
                break;
          }
        }
        return throwError(error);
      })
    )
  }
}