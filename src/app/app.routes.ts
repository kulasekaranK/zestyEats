import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { MenuComponent } from './menu/menu.component';
import { AccountComponent } from './account/account.component';
import { ManageFoodItemsComponent } from './manage-food-items/manage-food-items.component';
import { EditFoodItemsComponent } from './edit-food-items/edit-food-items.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { authGuard } from './auth.guard';
import { NewOrdersComponent } from './new-orders/new-orders.component';

export const routes: Routes = [
    {path:"", component:WelcomeComponent},
    {path:"login", component:LoginComponent},
    {path:"register", component:RegisterComponent},
    {path:"reset-password", component:ResetPasswordComponent},
    {path:"home", component:HomeComponent,canActivate:[authGuard]},
    {path:"admin", component:AdminComponent,canActivate:[authGuard]},
    {path:"restaurant",component:RestaurantComponent},
    {path:"menu",component:MenuComponent,canActivate:[authGuard]},
    {path:"account", component:AccountComponent,canActivate:[authGuard]},
    {path:"manage-food-items", component:ManageFoodItemsComponent,canActivate:[authGuard]},
    {path:"edit-food-item/:id", component:EditFoodItemsComponent,canActivate:[authGuard]},
    {path:"cart",component:CartComponent,canActivate:[authGuard]},
    {path:"orders",component:OrdersComponent,canActivate:[authGuard]},
    {path:"order-history",component:OrderManagementComponent,canActivate:[authGuard]},
    {path:"new-orders", component:NewOrdersComponent,canActivate:[authGuard]}
];
