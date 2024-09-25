import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFoodItemsComponent } from './edit-food-items.component';

describe('EditFoodItemsComponent', () => {
  let component: EditFoodItemsComponent;
  let fixture: ComponentFixture<EditFoodItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFoodItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFoodItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
