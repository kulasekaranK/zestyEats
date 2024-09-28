import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { deleteDoc, Firestore, onSnapshot } from '@angular/fire/firestore';
import {
  FormBuilder,
 
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { addDoc, collection, doc, FieldValue, serverTimestamp} from 'firebase/firestore';
import { AuthService } from '../service/auth.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-manage-food-items',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AdminNavbarComponent,
    RouterLink,
  ],
  templateUrl: './manage-food-items.component.html',
  styleUrl: './manage-food-items.component.scss',
})
export class ManageFoodItemsComponent {
  foodForm: FormGroup;
  uid: string = '';
  role: string = 'restaurantUser';
  message: string = '';
  menuSubject = new BehaviorSubject<any[] | null>(null);
  menu$ = this.menuSubject.asObservable();
  selectedFile:File|null = null;
  foodImgLink:string ="";
  newCategory='';
  newCategoryimg='';
  categorys:any;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
   
  ) {
    this.foodForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      isVegetarian: ['', Validators.required],
    });
    this.loadmenu();
    this.loadCategory();
  }
  async addCatogery(){
    const collectionRef = collection(this.firestore, "categorys");
    await addDoc(collectionRef,{name:this.newCategory,url:this.newCategoryimg});
    alert("New catogery added")
  }
  
  async loadCategory(){
    const collectionRef = collection(this.firestore, "categorys");
    onSnapshot(collectionRef,(snapshot)=>{
      this.categorys = snapshot.docs.map((doc)=>({id:doc.id, ...doc.data()}));
      console.log(this.categorys);
      
    })
  }
  async addFood() {
    if (this.foodForm.valid) {
      try {
        const foodItem ={ ...this.foodForm.value, createdAt: serverTimestamp(), 
          isVegetarian: this.foodForm.value.isVegetarian === 'true',
          available:true }
        const collectionRef = collection(this.firestore, 'foodItems');
        await addDoc(collectionRef, foodItem);
        alert('add successfuly');
        this.foodForm.reset();
       
      } catch {
        console.error('error adding food item');
      }
    } else {
      alert('form is not valid');
    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
 
  signout() {
    this.auth.signOut();
  }

  async loadmenu() {
    try {
      const collectionRef = collection(this.firestore, 'foodItems');
      onSnapshot(collectionRef, (snapshot) => {
        this.menuSubject.next(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
    } catch {}
  }
  edit(menuid: any) {
   
    this.router.navigate(['/edit-food-item', menuid]);
  }
 async deleteMenu(menuId:any){
    const docRef = doc(this.firestore, `foodItems/${menuId}`);
    await deleteDoc(docRef)

  }
}


