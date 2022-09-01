export interface ISectionStats {
    idSection?: number;
    idVideosFinished?: number[];
  }
  
  export class SectionStats implements ISectionStats {
    constructor(
      public idSection?: number,
      public idVideosFinished?: number[],
    ) {}
  }