import { IPdfLectureStats } from './PdfLectureStats.model';
import { ISectionStats } from './SectionsStats.model';

export interface IStatsLectureVideo {
    sections?: ISectionStats[];
    pdfLecture?: IPdfLectureStats;
  }
  
  export class StatsLectureVideo implements IStatsLectureVideo {
    constructor(
      public sections?: ISectionStats[],
      public pdfLecture?: IPdfLectureStats,
    ) {}
  }