import rawPlants from '../data/plants.json';
import { plantsSchema, type PublishedPlant } from './plantSchema';

// Build-time validation: invalid records must stop generation.
const plants = plantsSchema.parse(rawPlants);

// Shared source for /, /plants/, [slug], and previous/next navigation.
export const publishedPlants: PublishedPlant[] = plants
  .filter((plant): plant is PublishedPlant => plant.status === 'published')
  .sort((a, b) => a.order - b.order);

export function getPublishedPlant(slug: string): PublishedPlant | undefined {
  return publishedPlants.find((plant) => plant.slug === slug);
}

export function getAdjacentPlants(slug: string) {
  const index = publishedPlants.findIndex((plant) => plant.slug === slug);
  if (index < 0) return { previous: undefined, next: undefined };
  return {
    previous: publishedPlants[index - 1],
    next: publishedPlants[index + 1],
  };
}
