import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  address:string ='';
  message: string = '';
  isPasswordVisible = false;
  constructor(
    private authservice: AuthService,
    private router: Router,
    private firestore: Firestore
  ) {}
  async register() {
    try {
      const collectionRef = collection(this.firestore, 'users');
      const userCredential = await this.authservice.register(
        this.email,
        this.password,

      );

      const uid = userCredential.user?.uid;
      await addDoc(collectionRef,{uid, name:this.name, email:this.email,address:this.address})
      this.router.navigate(['/login'])
    } catch(error) {
      console.log("error:",error);
      
      this.message = 'This email is already registered.';
      setTimeout(()=>{
        this.message =""
      },5000)
    }
  }
  togglePasswordVisibility(){
    this.isPasswordVisible = !this.isPasswordVisible
  }
}
