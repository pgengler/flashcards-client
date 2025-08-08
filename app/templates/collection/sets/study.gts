import type { TOC } from '@ember/component/template-only';
import CardSetHeader from 'flashcards/components/card-set-header';
import StudySession from 'flashcards/components/study-session';
import type { CollectionSetsStudyRouteModel } from 'flashcards/routes/collection/sets/study';

interface CollectionSetsStudySignature {
  Args: {
    model: CollectionSetsStudyRouteModel;
  };
}

export default <template>
  <CardSetHeader @cardSet={{@model.cardSet}} @editable={{true}} />

  <StudySession @cards={{@model.cardSet.cards}} />
</template> satisfies TOC<CollectionSetsStudySignature>;
