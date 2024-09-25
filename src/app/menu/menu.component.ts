import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { addDoc, Firestore } from '@angular/fire/firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from '@angular/forms';

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

  constructor(private firestore: Firestore, private authservice: AuthService) {
    this.loadmenu();
    this.authservice.users$.subscribe((user) => {
      this.user = user;
    });
  }

  async loadmenu() {
    try {
      const collectionRef = collection(this.firestore, 'foodItems');
      onSnapshot(collectionRef, (snapshot) => {
        const menuItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        this.menuSubject.next(menuItems);
        this.searchFood = menuItems; 
      });
    } catch (error) {
      console.error("Error loading menu:", error);
    }
  }

 
  filterMenu() {
    this.searchFood = this.menuSubject.getValue()?.filter(menu => 
      menu.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    ) || [];
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
