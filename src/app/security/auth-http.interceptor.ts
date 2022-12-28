import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  allowedPaths: Map<string, string[]> = new Map<string, string[]>([
    ['/authentication/login', ['POST']],
    ['/authentication/forgot-password', ['POST']],
    ['/authentication/create-new-password', ['POST']],
    ['/users', ['POST']],
  ])

  constructor(private auth: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.includes(req.url, req.method))
      return next.handle(req);

    req = req.clone({
      setHeaders: {
        Authorization: `Basic ${this.auth.encodedAuth}`
      }
    });

    return next.handle(req);
  }

  includes(url: string, method: string): boolean {
    for (let path of this.allowedPaths) {
      if (url.includes(path[0]) && path[1].includes(method))
        return true;
    }

    return false;
  }
}