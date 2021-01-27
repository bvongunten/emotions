import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'team',
        loadChildren: () => import('./team/team.module').then(m => m.EmotionsTeamModule),
      },
      {
        path: 'mood-measurement',
        loadChildren: () => import('./mood-measurement/mood-measurement.module').then(m => m.EmotionsMoodMeasurementModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EmotionsEntityModule {}
