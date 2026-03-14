export interface Meditation {
  id: number;
  title: string;
  duration: string;
  locked: boolean;
}

export const meditations: Meditation[] = [
  { id: 1, title: "Morning Calm", duration: "5 min", locked: false },
  { id: 2, title: "Deep Focus", duration: "10 min", locked: true },
  { id: 3, title: "Sleep Recovery", duration: "15 min", locked: true },
  { id: 4, title: "Stress Reset", duration: "8 min", locked: true }
];
