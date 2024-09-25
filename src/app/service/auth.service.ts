import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth,
  getIdTokenResult,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Route, Router } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
  UserCredential,
} from 'firebase/auth';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  users$ = this.userSubject.asObservable();
  private role ="";


  private async getRole(user: User): Promise<any | null> {
    try {
      const tokenResult = await getIdTokenResult(user);
      return tokenResult.claims['role'] || null;
    } catch {
      return null;
    }
  }
  
  private navigateByRole(role: string | null) {
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'restaurantUser') {
      this.router.navigate(['/home']);
    } else if (role === null) {
      this.router.navigate(['/home']);
    }
  }
 

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient
  ) {
    onAuthStateChanged(this.auth, async (user) => {
      this.userSubject.next(user);
      if (user) {
        
        const role = await this.getRole(user);
        this.role = role;
        
        localStorage.setItem("user",JSON.stringify(user));
       
      }
    });
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.navigateByRole(this.role);
 
  }
  google():Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider())
    
  }
  apple() {
    return signInWithPopup(this.auth, new OAuthProvider('apple.com'));
  }
  facebook(){
    return signInWithPopup(this.auth, new FacebookAuthProvider())
  }
  sendResetLink(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async signOut() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
    localStorage.removeItem("user")
  }
}
