import type { TOC } from '@ember/component/template-only';
import CollectionHeader from 'flashcards/components/collection-header';
import StudySession from 'flashcards/components/study-session';
import type { CollectionRouteModel } from 'flashcards/routes/collection';

interface CollectionStudySignature {
  Args: {
    model: CollectionRouteModel;
  };
}

export default <template>
  <CollectionHeader @collection={{@model.collection}} @editable={{true}} />

  <StudySession @cards={{@model.collection.cards}} />
</template> satisfies TOC<CollectionStudySignature>;
