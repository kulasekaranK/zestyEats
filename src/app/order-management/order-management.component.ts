import { Component } from '@angular/core';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, orderBy } from '@angular/fire/firestore';
import { collection, getDocs, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { BehaviorSubject, timestamp } from 'rxjs';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [AdminNavbarComponent, FormsModule, CommonModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss',
})
export class OrderManagementComponent {
  ordersubject = new BehaviorSubject<any[]>([]);
  orders$ = this.ordersubject.asObservable();
  selectedStatus: string = ''; 
  constructor(private firestore: Firestore) {
    this.loadOrders();
  }
  async loadOrders() {
    const collectionRef = collection(this.firestore, 'orders');
    const q = query(collectionRef,orderBy("createdAt","desc"));
    onSnapshot(q, async (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.ordersubject.next(await this.loadOrderItems(orders));
    });
  }
  async loadOrderItems(orders: any) {
    const orderWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const collectionRef = collection(this.firestore,`orders/${order.id}/items`);
        const q = query(collectionRef, orderBy("date","desc"))
        const itemSnapshot = await getDocs(q);
        let items = itemSnapshot.docs.map((doc)=>{
          const data = doc.data();
          if(data['date'] instanceof Timestamp){
            data['date'] = data['date'].toDate();

          }
          return data;
        })
        if(this.selectedStatus){
          items = items.filter(items => items['status'] === this.selectedStatus)
        }
        return {...order, items};
      })
    );
    return orderWithItems;
  }
  filterOrders(){
   this.loadOrders()
    
  }
}
