import type { TOC } from '@ember/component/template-only';
import Card from 'flashcards/components/card';
import type { CollectionRandomCardRouteModel } from 'flashcards/routes/collection/card/random';

interface CollectionCardRandomSignature {
  Args: {
    model: CollectionRandomCardRouteModel;
  };
}

export default <template><Card @card={{@model.card}} /></template> satisfies TOC<CollectionCardRandomSignature>;
