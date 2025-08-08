import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import Component from '@glimmer/component';
import onKey from 'ember-keyboard/modifiers/on-key';
import type Collection from 'flashcards/models/collection';
import type CurrentCollectionService from 'flashcards/services/current-collection';

function isInput(element: Element | null) {
  if (!element) return false;
  const tagName = element.tagName;
  if (tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') {
    return true;
  }
  return false;
}

export default class TopNav extends Component {
  @service declare currentCollection: CurrentCollectionService;
  @service declare router: RouterService;
  @service declare store: Store;

  get collections() {
    return (<Collection[]>this.store.peekAll('collection')).filter((collection) => !collection.isNew);
  }

  get collection() {
    return this.currentCollection.currentCollection!;
  }

  @action
  randomCard(event: Event) {
    if (isInput(<Element | null>event.target)) {
      return;
    }

    if (this.router.currentRouteName === 'collection.card.random') {
      this.router.refresh();
    } else {
      this.router.transitionTo('collection.card.random', this.collection.slug);
    }
  }

  <template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <LinkTo @route="index" class="navbar-brand">
          Flashcards
        </LinkTo>

        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-test-collections-toggle
            >
              Collections
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown" data-test-collections-menu>
              {{#each this.collections as |collection|}}
                <li>
                  <LinkTo
                    @route="collection"
                    @model={{collection.slug}}
                    class="dropdown-item"
                    data-test-collection-item
                  >
                    {{collection.name}}
                  </LinkTo>
                </li>
              {{/each}}
              <li><hr class="dropdown-divider" /></li>
              <li>
                <LinkTo @route="collections.new" class="dropdown-item" data-test-new-collection-item>
                  Add new collection
                </LinkTo>
              </li>
            </ul>
          </li>

          {{#if this.collection}}
            <li class="nav-item">
              <LinkTo @route="collection.card.new" @model={{this.collection.slug}} class="nav-link">
                New
              </LinkTo>
            </li>

            {{#if this.collection.cards}}
              <li class="nav-item" data-test-random-card>
                <button
                  type="button"
                  class="btn btn-link nav-link border-0"
                  {{on "click" this.randomCard}}
                  {{onKey "r" this.randomCard}}
                >
                  Random card
                </button>
              </li>
            {{/if}}

            <li class="nav-item" data-test-card-sets>
              <LinkTo @route="collection.sets.new" @model={{this.collection.slug}} class="nav-link">
                New set
              </LinkTo>
            </li>
          {{/if}}
        </ul>
      </div>
    </nav>
  </template>
}
