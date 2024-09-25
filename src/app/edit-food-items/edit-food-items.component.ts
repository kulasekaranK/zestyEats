import { Component, OnInit } from '@angular/core';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-edit-food-items',
  standalone: true,
  imports: [
    AdminNavbarComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './edit-food-items.component.html',
  styleUrl: './edit-food-items.component.scss',
})
export class EditFoodItemsComponent implements OnInit {
  menuId:string = "";
  menu$:Observable<any> = of([])

  constructor(
    private firestore: Firestore,
    private router: Router,
    private route:ActivatedRoute
  ) {
    
    this.loadMenu();
  }
  async ngOnInit(){
    this.route.paramMap.subscribe(async (params)=>{
      this.menuId = params.get('id')!;

    const docRef = doc(this.firestore, `foodItems/${params.get('id')}`);
    const docSnap =  getDoc(docRef);
    if((await docSnap).exists()){
      this.menu$ = of((await docSnap).data());
      
    }
 

    })
  }
  async loadMenu(){
   
    
    

  }
  async updateFood(f:any) {
 const docref = doc(this.firestore, `foodItems/${this.menuId}`);
 await updateDoc(docref,{
  name:f.value.name,
  price:f.value.price,
  description:f.value.description,
  image:f.value.image,
  isVegetarian:f.value.isVegetarian,
  category:f.value.category
 })
this.router.navigate(['/manage-food-items'])

    
    
  }
}
