import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCrudTableComponent } from './user-crud-table.component';

describe('UserCrudTableComponent', () => {
  let component: UserCrudTableComponent;
  let fixture: ComponentFixture<UserCrudTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCrudTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCrudTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
