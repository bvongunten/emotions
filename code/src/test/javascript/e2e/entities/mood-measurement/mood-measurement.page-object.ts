import { element, by, ElementFinder } from 'protractor';

export class MoodMeasurementComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-mood-measurement div table .btn-danger'));
  title = element.all(by.css('jhi-mood-measurement div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class MoodMeasurementUpdatePage {
  pageTitle = element(by.id('jhi-mood-measurement-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  moodInput = element(by.id('field_mood'));
  messageInput = element(by.id('field_message'));
  dateInput = element(by.id('field_date'));

  userSelect = element(by.id('field_user'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setMoodInput(mood: string): Promise<void> {
    await this.moodInput.sendKeys(mood);
  }

  async getMoodInput(): Promise<string> {
    return await this.moodInput.getAttribute('value');
  }

  async setMessageInput(message: string): Promise<void> {
    await this.messageInput.sendKeys(message);
  }

  async getMessageInput(): Promise<string> {
    return await this.messageInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class MoodMeasurementDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-moodMeasurement-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-moodMeasurement'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
