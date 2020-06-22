export class AppLink {
  idx: number;
  display?: string[];
  params?: any;

  constructor(
    data: any = {},
  ) {
    this.idx = data.idx;
  }

}
