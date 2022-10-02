export interface IPdfLectureStats {
    totalPage?: number;
    currentPage?: number;
  }
  
  export class PdfLectureStats implements IPdfLectureStats {
    constructor(
      public totalPage?: number,
      public currentPage?: number,
    ) {}
  }