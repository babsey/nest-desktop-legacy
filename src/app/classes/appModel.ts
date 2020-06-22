export class AppModel {
  display: string[];

  constructor(
    data: any = {},
  ) {
    this.display = data['display'] || [];
  }

}
