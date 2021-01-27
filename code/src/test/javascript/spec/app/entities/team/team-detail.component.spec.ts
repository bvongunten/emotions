import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { EmotionsTestModule } from '../../../test.module';
import { TeamDetailComponent } from 'app/entities/team/team-detail.component';
import { Team } from 'app/shared/model/team.model';

describe('Component Tests', () => {
  describe('Team Management Detail Component', () => {
    let comp: TeamDetailComponent;
    let fixture: ComponentFixture<TeamDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ team: new Team(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EmotionsTestModule],
        declarations: [TeamDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(TeamDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TeamDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load team on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.team).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });

    describe('byteSize', () => {
      it('Should call byteSize from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'byteSize');
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.byteSize(fakeBase64);

        // THEN
        expect(dataUtils.byteSize).toBeCalledWith(fakeBase64);
      });
    });

    describe('openFile', () => {
      it('Should call openFile from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'openFile');
        const fakeContentType = 'fake content type';
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.openFile(fakeContentType, fakeBase64);

        // THEN
        expect(dataUtils.openFile).toBeCalledWith(fakeContentType, fakeBase64);
      });
    });
  });
});
