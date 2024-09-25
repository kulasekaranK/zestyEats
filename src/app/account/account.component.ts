import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../service/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterLink],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  user: any;
  euser: Observable<any[]> = of([]);

  totalOrders = 0;




  constructor(private authService: AuthService, private firestore: Firestore) {
    this.loadProfile();
    this.loadOrders();
   
  }
  async loadProfile() {
    const collectionRef = collection(this.firestore, 'users');

    this.authService.users$.subscribe((user) => {
      this.user = user;
      const queryRef = query(collectionRef, where('uid', '==', this.user.uid));
      onSnapshot(queryRef, (snapshot) => {
        this.euser = of(snapshot.docs.map((doc) => doc.data()));
      });
    });
    console.log(this.user);
  }
   async loadOrders(){
    try{
      const collectionRef = collection(this.firestore, "orders");
      const q = query(collectionRef, where("uid","==",this.user.uid))
      onSnapshot(q, async (snapshot)=>{
        const orders = snapshot.docs.map(doc=>({id:doc.id, ...doc.data()}));
        const ordersWithItems = await this.loadOrdersItems(orders);
            this.caltotalOrders(ordersWithItems);
      })
    }
    catch{}

   }
   async loadOrdersItems(orders:any){
    const ordersWithItems = await Promise.all(
      orders.map(async(order:any)=>{
        const itemCollectionRef = collection(this.firestore, `orders/${order.id}/items`);
        const itemsDoc = getDocs(itemCollectionRef);
        const items = (await itemsDoc).docs.map(doc=>doc.data());
        return {items, ...order}
       
      })
    )
    return ordersWithItems;
   }

  logOut() {
    this.authService.signOut();
  }
caltotalOrders(orders:any){
  this.totalOrders = orders.reduce((total: any,order:{items:any[]})=>total+order.items.length,0)

  

}
}

