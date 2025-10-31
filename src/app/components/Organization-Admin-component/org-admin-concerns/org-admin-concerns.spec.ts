import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgAdminConcerns } from './org-admin-concerns';

describe('OrgAdminConcerns', () => {
  let component: OrgAdminConcerns;
  let fixture: ComponentFixture<OrgAdminConcerns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgAdminConcerns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgAdminConcerns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
