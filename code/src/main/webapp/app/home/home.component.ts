import { Component, OnInit, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import {IMoodMeasurement, MoodMeasurement} from "app/shared/model/mood-measurement.model";
import {MoodMeasurementService} from "app/entities/mood-measurement/mood-measurement.service";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;

  isSaved = false;

  // Simple values
  textMessage = '';
  moodValue = 75;

  constructor(private accountService: AccountService, private loginModalService: LoginModalService, private moodMeasurementService: MoodMeasurementService ) {}



  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
  }

  setMood(moodValue : number) : void {
    this.moodValue = moodValue;
  }

  saveMood(): void {

    const moodMeasurement = new MoodMeasurement();
    moodMeasurement.message = this.textMessage;
    moodMeasurement.mood = this.moodValue;
    this.subscribeToSaveResponse(this.moodMeasurementService.create(moodMeasurement));

  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMoodMeasurement>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaved = true;
  }

  protected onSaveError(): void {
    // Nothing
  }


  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
