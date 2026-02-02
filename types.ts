
export enum AcademicLevel {
  BACHELOR = 'Bachelor of Science',
  MASTER = 'Master of Science',
  PHD = 'Doctor of Philosophy',
  POSTDOC = 'Post-Doctoral Research'
}

export enum Faculty {
  SCIENCE_TECH = 'Faculty of Science & Technology',
  HEALTH_SCIENCES = 'Faculty of Health Sciences',
  ENGINEERING = 'Faculty of Engineering'
}

export interface Lesson {
  id: string;
  title: string;
  code: string;
  description: string;
  content: string;
}

export interface Course {
  id: string;
  name: string;
  level: AcademicLevel;
  faculty: Faculty;
  university: string;
  years: number;
  lessons: Lesson[];
}

export interface BatchAsset {
  id: string;
  original: string;
  edited: string | null;
  status: 'idle' | 'processing' | 'done' | 'error';
  error: string | null;
}

export interface AIEditState {
  assets: BatchAsset[];
  selectedIndex: number;
  loading: boolean;
  error: string | null;
  prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  grounding?: any[];
}

export type AppView = 'home' | 'courses' | 'ai-studio' | 'course-detail' | 'ai-advisor' | 'lab-reports' | 'thesis-architect' | 'media-lab' | 'live-lounge';
