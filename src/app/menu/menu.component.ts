import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { addDoc, Firestore } from '@angular/fire/firestore';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { async, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FooterComponent,FormsModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  menuSubject = new BehaviorSubject<any[] | null>(null);
  menu$ = this.menuSubject.asObservable();
  user: any;
  alert = "";
  searchTerm: string = '';
  searchFood: any[] = [];
  isloading= true;
  categorys:any;
  selectedcategory = '';

  constructor(private firestore: Firestore, private authservice: AuthService,private route:ActivatedRoute) {
    this.authservice.users$.subscribe((user) => {
      this.user = user;
    });
  


  
    this.loadmenu();
    this.loadCategory();
  }

  async loadmenu() {
    try {
      const collectionRef = collection(this.firestore, 'foodItems');
      onSnapshot(collectionRef, (snapshot) => {
        const menuItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        this.menuSubject.next(menuItems);
        this.searchFood = menuItems; 
        this.isloading = false;
        this.route.queryParams.subscribe((param)=>{
          console.log(param);
          if(param['category']){
             this.selectedcategory = param['category'];
             this.menu$.subscribe(menu => {  
              if (menu) {  
                this.filterMenu();  
              }  
             });  
          }
        });
      });
    } catch (error) {
      console.error("Error loading menu:", error);
      this.isloading = false;
    }
  }

 
  filterMenu() {
    console.log(this.selectedcategory);
    
    this.searchFood = this.menuSubject.getValue()?.filter(menu => 
      menu.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      && (this.selectedcategory===""|| menu.category === this.selectedcategory) ) || [];
      console.log("loaded");
      console.log(this.selectedcategory);
      
      
  }
  filterByCategory(category:any){
    this.selectedcategory = category;
    this.filterMenu();

  }
  loadCategory(){
    const collectionRef = collection(this.firestore, "categorys");
    onSnapshot(collectionRef, (snapshot)=>{
      this.categorys = snapshot.docs.map((doc)=>doc.data())
    })
  }

  async addToCart(menu: any) {
    try {
      const collectionRef = collection(this.firestore, 'carts/');
      await addDoc(collectionRef, {
        docId: menu.id,
        uid: this.user.uid,
        name: menu.name,
        price: menu.price,
        image: menu.image,
        quantity: 1,
      });
      this.alert = "Item added to your cart successfully!";
      setTimeout(() => {
        this.alert = "";
      }, 5000);
      console.log('Item added to cart successfully!');
    } catch (error) {
      this.alert = "Oops! Something went wrong while adding the item to your cart. Please try again.";
      console.error('Error adding to cart:', error);
    }
  }
}
