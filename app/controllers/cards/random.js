import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class RandomCardsController extends Controller {
  queryParams = ['side'];
  @tracked side = '';
}
