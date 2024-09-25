import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  message:string ="";
  email:string ="";
  password:string = "";
  isPasswordVisible = false
  constructor(private authService:AuthService, private router:Router,private firestore:Firestore){}
  login(){
    this.authService.login(this.email, this.password).then(()=>{
       
    }).catch(()=>{
      this.message="Please Enter Valied Email and Password!"
    })
  }

 async google(){
  try{
    const collectionRef = collection(this.firestore, "users");
    const userCredential = await this.authService.google();
    const user = userCredential.user;
    const userQuery = query(collectionRef, where("uid","==",user.uid));
    const querySnapshot = await getDocs(userQuery);
    if(querySnapshot.empty){
    


    await addDoc(collectionRef,{uid:user.uid,name:user.displayName,email:user.email})
    }
    this.router.navigate(['/home']);
  }
  catch{
   this.message =" error during google login!"
  }
    
  }
  async facebook(){
    try{
      const collectionRef = collection(this.firestore, "users");
      const userCredential = await this.authService.facebook();
      const user = userCredential.user;
      const userQuery = query(collectionRef, where("uid","==",user.uid));
      const querySnapshot = await getDocs(userQuery);
      if(querySnapshot.empty){
      
  
  
      await addDoc(collectionRef,{uid:user.uid,name:user.displayName,email:user.email})
      }
      this.router.navigate(['/home']);
    }
    catch{
     this.message =" error during facebook login!"
    }
      
    }
  apple(){
    this.authService.apple()

  }
  togglePasswordVisibility(){
    this.isPasswordVisible = !this.isPasswordVisible;  
  }
}
