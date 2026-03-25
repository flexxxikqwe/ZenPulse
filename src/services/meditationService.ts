import { Meditation, meditations } from '../data/meditations';

export interface MeditationService {
  getMeditations(): Promise<Meditation[]>;
  getMeditationById(id: string): Promise<Meditation | undefined>;
  getFeaturedMeditations(): Promise<Meditation[]>;
  getNewMeditations(): Promise<Meditation[]>;
}

class StaticMeditationService implements MeditationService {
  private cache: Meditation[] | null = null;

  async getMeditations(): Promise<Meditation[]> {
    if (this.cache) return [...this.cache];
    
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        this.cache = [...meditations];
        resolve(this.cache);
      }, 100);
    });
  }

  async getMeditationById(id: string): Promise<Meditation | undefined> {
    const all = await this.getMeditations();
    return all.find(m => m.id === id);
  }

  async getFeaturedMeditations(): Promise<Meditation[]> {
    const all = await this.getMeditations();
    return all.filter(m => m.isFeatured);
  }

  async getNewMeditations(): Promise<Meditation[]> {
    const all = await this.getMeditations();
    return all.filter(m => m.isNew);
  }
}

export const meditationService: MeditationService = new StaticMeditationService();
