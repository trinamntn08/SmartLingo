import type { Lesson } from '@smartlingo/domain';
import { sharedEntries } from './shared-entries';

// Explicit, stable aliases for the same sense. Context-specific senses (guichet,
// horaire) retain separate IDs. The first starter's existing IDs never change.
const aliases: Readonly<Record<string, string>> = {
  'fr.people.bonjour': 'fr.bonjour',
  'fr.leisure.a-l-interieur': 'fr.restaurant.inside',
  'fr.health.allergie': 'fr.restaurant.allergy',
  'fr.health.demain': 'fr.bakery.tomorrow',
  'fr.leisure.velo': 'fr.transport.bicycle',
  'fr.essentials.please': 'fr.silvousplait',
  'fr.social.bring': 'fr.restaurant.bring',
  'fr.calendar.tomorrow': 'fr.bakery.tomorrow',
  'fr.groceries.check': 'fr.work.verifier',
  'fr.housing.live-in': 'fr.people.habiter',
  'fr.education.ouvrir': 'fr.housing.open',
  'fr.calendar.available': 'fr.health.disponible',
  'fr.social.cancel': 'fr.health.annuler',
  'fr.social.confirm': 'fr.health.confirmer',
  'fr.digital.send': 'fr.work.envoyer',
  'fr.social.together': 'fr.work.ensemble',
  'fr.directions.town-hall': 'fr.administration.mairie',
  'fr.directions.street': 'fr.administration.rue',
  'fr.essentials.spell': 'fr.administration.epeler',
  'fr.digital.email-address': 'fr.administration.adresse-mail',
  'fr.directions.post-office': 'fr.administration.poste',
  'fr.digital.connection': 'fr.administration.connexion',
  'fr.accommodation.password': 'fr.administration.mot-de-passe',
  'fr.digital.password': 'fr.administration.mot-de-passe',
  'fr.digital.network': 'fr.administration.reseau',
  'fr.digital.log-in': 'fr.administration.se-connecter',
  'fr.digital.attachment': 'fr.administration.piece-jointe',
  'fr.numbers.zero': 'fr.routine.zero',
  'fr.numbers.two': 'fr.routine.deux',
  'fr.numbers.three': 'fr.routine.trois',
  'fr.numbers.four': 'fr.routine.quatre',
  'fr.numbers.five': 'fr.routine.cinq',
  'fr.numbers.ten': 'fr.routine.dix',
  'fr.calendar.today': 'fr.routine.aujourdhui',
  'fr.calendar.week': 'fr.routine.semaine',
  'fr.calendar.monday': 'fr.routine.lundi',
  'fr.calendar.saturday': 'fr.routine.samedi',
  'fr.calendar.date': 'fr.routine.date',
  'fr.social.invite': 'fr.leisure.inviter',
  'fr.social.fancy': 'fr.leisure.ca-te-dit',
  'fr.social.with-pleasure': 'fr.leisure.avec-plaisir',
  'fr.social.another-time': 'fr.leisure.une-autre-fois',
  'fr.social.busy': 'fr.leisure.occupe',
  'fr.social.rather': 'fr.leisure.plutot',
  'fr.social.postpone': 'fr.leisure.reporter',
  'fr.jobsearch.exemple': 'fr.essentials.example',
  'fr.social.let-know': 'fr.education.prevenir',
  'fr.shopping.look-for-item': 'fr.groceries.look-for',
  'fr.past.first': 'fr.routine.d-abord',
  'fr.past.next': 'fr.routine.ensuite',
};

export function reuseSharedVocabulary(lessons: readonly Lesson[]): Lesson[] {
  // Canonical senses outlive the lesson that first introduced them. Keep exact
  // payloads when redundant introduction slots are replaced in later drafts.
  const entries = new Map(sharedEntries.map(entry => [entry.id, entry]));
  for (const entry of lessons.flatMap(lesson => lesson.vocabulary)) {
    const previous = entries.get(entry.id);
    if (previous && JSON.stringify(previous) !== JSON.stringify(entry)) throw new Error(`Conflicting vocabulary: ${entry.id}`);
    entries.set(entry.id, entry);
  }
  const resolve = (id: string) => aliases[id] ?? id;
  return lessons.map(lesson => ({
    ...lesson,
    vocabulary: lesson.vocabulary.map(entry => {
      const canonical = entries.get(resolve(entry.id));
      if (!canonical) throw new Error(`Missing shared vocabulary: ${entry.id}`);
      if (canonical.target.normalize('NFC') !== entry.target.normalize('NFC')) throw new Error(`Shared vocabulary target changed: ${entry.id}`);
      return canonical;
    }),
    pictureActivity: { ...lesson.pictureActivity, entryId: resolve(lesson.pictureActivity.entryId),
      choices: lesson.pictureActivity.choices.map(resolve) },
  }));
}
