import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MoodMeasurementComponentsPage, MoodMeasurementDeleteDialog, MoodMeasurementUpdatePage } from './mood-measurement.page-object';

const expect = chai.expect;

describe('MoodMeasurement e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let moodMeasurementComponentsPage: MoodMeasurementComponentsPage;
  let moodMeasurementUpdatePage: MoodMeasurementUpdatePage;
  let moodMeasurementDeleteDialog: MoodMeasurementDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load MoodMeasurements', async () => {
    await navBarPage.goToEntity('mood-measurement');
    moodMeasurementComponentsPage = new MoodMeasurementComponentsPage();
    await browser.wait(ec.visibilityOf(moodMeasurementComponentsPage.title), 5000);
    expect(await moodMeasurementComponentsPage.getTitle()).to.eq('emotionsApp.moodMeasurement.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(moodMeasurementComponentsPage.entities), ec.visibilityOf(moodMeasurementComponentsPage.noResult)),
      1000
    );
  });

  it('should load create MoodMeasurement page', async () => {
    await moodMeasurementComponentsPage.clickOnCreateButton();
    moodMeasurementUpdatePage = new MoodMeasurementUpdatePage();
    expect(await moodMeasurementUpdatePage.getPageTitle()).to.eq('emotionsApp.moodMeasurement.home.createOrEditLabel');
    await moodMeasurementUpdatePage.cancel();
  });

  it('should create and save MoodMeasurements', async () => {
    const nbButtonsBeforeCreate = await moodMeasurementComponentsPage.countDeleteButtons();

    await moodMeasurementComponentsPage.clickOnCreateButton();

    await promise.all([
      moodMeasurementUpdatePage.setMoodInput('5'),
      moodMeasurementUpdatePage.setMessageInput('message'),
      moodMeasurementUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      moodMeasurementUpdatePage.userSelectLastOption(),
    ]);

    expect(await moodMeasurementUpdatePage.getMoodInput()).to.eq('5', 'Expected mood value to be equals to 5');
    expect(await moodMeasurementUpdatePage.getMessageInput()).to.eq('message', 'Expected Message value to be equals to message');
    expect(await moodMeasurementUpdatePage.getDateInput()).to.contain('2001-01-01T02:30', 'Expected date value to be equals to 2000-12-31');

    await moodMeasurementUpdatePage.save();
    expect(await moodMeasurementUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await moodMeasurementComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last MoodMeasurement', async () => {
    const nbButtonsBeforeDelete = await moodMeasurementComponentsPage.countDeleteButtons();
    await moodMeasurementComponentsPage.clickOnLastDeleteButton();

    moodMeasurementDeleteDialog = new MoodMeasurementDeleteDialog();
    expect(await moodMeasurementDeleteDialog.getDialogTitle()).to.eq('emotionsApp.moodMeasurement.delete.question');
    await moodMeasurementDeleteDialog.clickOnConfirmButton();

    expect(await moodMeasurementComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
