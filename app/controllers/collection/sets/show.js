import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CollectionSetsShowController extends Controller {
  @tracked showingManageCardsForm = false;

  @action
  showManageCardsForm() {
    this.showingManageCardsForm = true;
  }

  @action
  hideManageCardsForm() {
    this.showingManageCardsForm = false;
  }
}
