import { normalizeSearch } from '@smartlingo/domain';
import { everydaySlang } from './everyday';
import { expressiveSlang } from './expressive';
import { slangCategories, type SlangCategory, type SlangExpression, type SlangSeed } from './types';

export { slangCategories, type SlangCategory, type SlangExpression, type SlangRegister } from './types';

export const slangCategoryIds = Object.keys(slangCategories) as SlangCategory[];
const seeds: Record<SlangCategory, readonly SlangSeed[]> = { ...everydaySlang, ...expressiveSlang };
const courseEntryIds: Partial<Record<string, string>> = {
  'ca-te-dit': 'fr.leisure.ca-te-dit',
  'ca-me-va': 'fr.social.suits-me',
};

const rankedExpressions = slangCategoryIds.flatMap(category =>
  seeds[category].map(([key, target, meaning, example, exampleMeaning, note, register = 'informal' as const, textAbbreviation = false], order) => {
    const id = `fr.slang.${key}`;
    const expression: SlangExpression = {
      id, sourceEntryId: courseEntryIds[key] ?? id, category, target, meaning, example, exampleMeaning, note, register, textAbbreviation,
    };
    return { order, expression };
  }));

export const slangExpressions: readonly SlangExpression[] = rankedExpressions
  .sort((a, b) => a.order - b.order)
  .map(({ expression }) => expression);

function normalizeSlang(value: string): string {
  return normalizeSearch(value).replace(/œ/g, 'oe').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

const searchIndex = slangExpressions.map(expression => ({
  expression,
  target: normalizeSlang(expression.target),
  meaning: normalizeSlang(expression.meaning),
  example: normalizeSlang(expression.example),
}));

export function findSlangExpressions(query: string, category: SlangCategory | null): SlangExpression[] {
  const search = normalizeSlang(query);
  const inCategory = searchIndex.filter(({ expression }) => category === null || expression.category === category);
  if (!search) return inCategory.map(({ expression }) => expression);
  const targetMatches: SlangExpression[] = [];
  const meaningMatches: SlangExpression[] = [];
  const exampleMatches: SlangExpression[] = [];
  for (const { expression, target, meaning, example } of inCategory) {
    if (target.includes(search)) targetMatches.push(expression);
    else if (meaning.includes(search)) meaningMatches.push(expression);
    else if (example.includes(search)) exampleMatches.push(expression);
  }
  return [...targetMatches, ...meaningMatches, ...exampleMatches];
}
