import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmotionsTestModule } from '../../../test.module';
import { MoodMeasurementDetailComponent } from 'app/entities/mood-measurement/mood-measurement-detail.component';
import { MoodMeasurement } from 'app/shared/model/mood-measurement.model';

describe('Component Tests', () => {
  describe('MoodMeasurement Management Detail Component', () => {
    let comp: MoodMeasurementDetailComponent;
    let fixture: ComponentFixture<MoodMeasurementDetailComponent>;
    const route = ({ data: of({ moodMeasurement: new MoodMeasurement(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmotionsTestModule],
        declarations: [MoodMeasurementDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(MoodMeasurementDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MoodMeasurementDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load moodMeasurement on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.moodMeasurement).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
