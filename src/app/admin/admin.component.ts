import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Firestore, orderBy } from '@angular/fire/firestore';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, AdminNavbarComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit{
  ordersubject = new BehaviorSubject<any[]>([]);
  orders$ =this.ordersubject.asObservable();
  usersubject = new BehaviorSubject<any[]>([]);
  users$ =this.usersubject.asObservable();
totalOrders:number = 0;
totalsales:number = 0;
totalMenu:any[] = [];


  constructor(private firestore: Firestore) {
    this.loadOrders();
    this.loadUsers(); 
    this.loadMenu()
  }
  ngOnInit(): void {
    this.loadOrders();
    this.loadUsers();
   
  }
  loadMenu(){
    const collectionRef = collection(this.firestore, "foodItems");
    onSnapshot(collectionRef,(snapshot)=>{
     this.totalMenu = snapshot.docs.map(doc=>doc.data());
    })
  }
 

 

  loadOrders() {
    const collectionRef = collection(this.firestore, 'orders');
    onSnapshot(collectionRef, async (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     const orderwithItems = await this.loadOrderItems(orders);
     this.ordersubject.next(orderwithItems)
     this.calcTotalOrder(orderwithItems)
     this.calTotalSales();
    });
  }

  async loadOrderItems(orders: any) {
    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const collectionRef = collection(this.firestore, `orders/${order.id}/items`);
        const docRef = await getDocs(collectionRef);
        const items = docRef.docs.map(doc => doc.data());
        return { ...order, items };
      })
    );
    return ordersWithItems;
  }
  calcTotalOrder(orders:any){
    this.totalOrders = orders.reduce((total: number,order: { items: any[] })=>total + order.items.length,0);

    
  }
  async loadUsers(){
    const collectionRef = collection(this.firestore,"users");
    const q = query(collectionRef, orderBy("uid", "asc"));
    onSnapshot(q, (snapshot)=>{
      this.usersubject.next(  snapshot.docs.map(doc=>doc.data()))
    });
    this.loadOrders();
  }
  calTotalSales(){
    this.orders$.subscribe((orders)=>{
      this.totalsales = orders.reduce((total,order)=>total+(order.totalAmount),0);
    })
  }
}
