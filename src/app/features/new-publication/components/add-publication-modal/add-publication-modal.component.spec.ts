import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPublicationModalComponent } from './add-publication-modal.component';

describe('AddPublicationModalComponent', () => {
  let component: AddPublicationModalComponent;
  let fixture: ComponentFixture<AddPublicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPublicationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPublicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
