import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LecteurSeriesUpdateComponent } from './lecteur-series-update.component';

describe('LecteurSeriesUpdateComponent', () => {
  let component: LecteurSeriesUpdateComponent;
  let fixture: ComponentFixture<LecteurSeriesUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LecteurSeriesUpdateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LecteurSeriesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
