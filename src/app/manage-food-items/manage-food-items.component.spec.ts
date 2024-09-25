import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFoodItemsComponent } from './manage-food-items.component';

describe('ManageFoodItemsComponent', () => {
  let component: ManageFoodItemsComponent;
  let fixture: ComponentFixture<ManageFoodItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFoodItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFoodItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
