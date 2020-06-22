export class SimCollection {
  model: string;
  n: number;
  params: any;
  spatial?: any;
  element_type: string;
  rows?: number;
  columns?: number;

  constructor(
    data: any = {}
  ) {
    this.model = data.model;
    this.n = data.n || 1;
    this.params = data.params || {};
    this.spatial = data.spatial || {};
    this.element_type = data.element_type;
    this.rows = data.rows;
    this.columns = data.columns;
  }

  clean(): void {
  }

  // Boolean functions

  isSpatial(): boolean {
    return Object.keys(this.spatial).length > 0;
  }
}
