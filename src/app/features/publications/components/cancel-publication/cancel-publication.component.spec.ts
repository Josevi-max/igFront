import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelPublicationComponent } from './cancel-publication.component';

describe('CancelPublicationComponent', () => {
  let component: CancelPublicationComponent;
  let fixture: ComponentFixture<CancelPublicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelPublicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
