import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Firestore, onSnapshot, orderBy } from '@angular/fire/firestore';
import { AuthService } from '../service/auth.service';
import { collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { BehaviorSubject, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NavbarComponent,CommonModule,FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  user: any;
  private ordersubject = new BehaviorSubject<any[]>([]);
  order$ = this.ordersubject.asObservable() 
  constructor(private firestore: Firestore, private authservice: AuthService) {
  }
  ngOnInit(): void {
    this.authservice.users$.subscribe((user) => {
      this.user = user;
      if(user){
        this.loadOrders();
      }
    });
   
  }
  loadOrders(){
    const collectionRef = collection(this.firestore, "orders/");
    const queryRef = query(collectionRef, orderBy("createdAt","desc"), where("uid","==",this.user.uid))
    onSnapshot(queryRef, async (snapshot) => {
      if (snapshot.empty) {
        this.ordersubject.next([]);
      } else {
        const order = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        this.ordersubject.next(await this.loadOrderItems(order));
      }
    });
  }
  async loadOrderItems(orders:any){
    const ordersWithItems = await Promise.all(
      orders.map(async (order:any)=>{
        const itemsCollectionRef = collection(this.firestore,`orders/${order.id}/items`);
        const itemsSnapshot = await getDocs(itemsCollectionRef);
        const items = itemsSnapshot.docs.map((itemDoc)=>itemDoc.data());
        return{...order, items };
      })
    );
    return ordersWithItems;


  }
}
