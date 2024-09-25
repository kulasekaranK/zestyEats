import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
 const user = localStorage.getItem("user")
  const router = inject(Router);
  if(user){
    return true;
  }
  else{
    router.navigate(['/login']);
    return false;
   
  }
 
};
