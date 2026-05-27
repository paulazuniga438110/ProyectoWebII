import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Intentamos obtener el token JWT que guardaste en el localStorage al hacer Login
  const token = localStorage.getItem('token');

  // 2. Si el token existe, clonamos la petición y le añadimos la cabecera Authorization
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }
  // 3. Si no hay token, la petición sigue su curso normal (útil para el endpoint de login público)
  return next(req);
};