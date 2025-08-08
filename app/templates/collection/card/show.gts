import type { TOC } from '@ember/component/template-only';
import Card from 'flashcards/components/card';
import type { CollectionShowCardRouteModel } from 'flashcards/routes/collection/card/show';

interface CollectionCardShowSignature {
  Args: {
    model: CollectionShowCardRouteModel;
  };
}

export default <template><Card @card={{@model.card}} /></template> satisfies TOC<CollectionCardShowSignature>;
