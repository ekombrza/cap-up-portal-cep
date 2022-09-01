import { ISectionStats } from './SectionsStats.model';

export interface IStatsLectureVideo {
    sections?: ISectionStats[];
  }
  
  export class StatsLectureVideo implements IStatsLectureVideo {
    constructor(
      public sections?: ISectionStats[],
    ) {}
  }