import { environment } from '../../environments/environment';


export class Config {
  private _name: string;

  constructor(name: string) {
    this._name = name;
    if (!this.isValid()) {
      this.upgrade()
    }
  }

  get assetData(): any {
    return require('../../assets/config/' + this._name + '.json');
  }

  get itemName(): string {
    return 'nest-desktop-' + this._name;
  }

  get data(): any {
    // check if item is existed in localstorage
    if (localStorage.hasOwnProperty(this.itemName)) {
      const dataJSON: string = localStorage.getItem(this.itemName);
      if (dataJSON) {
        return JSON.parse(dataJSON);
      }
    }
    this.data = this.assetData;       // create item in localstorage
    return this.data;                 // recursive call after item created in localstorage
  }

  set data(value: any) {
    value['version'] = environment.VERSION;           // update version of config in localstorage
    const dataJSON = JSON.stringify(value);           // convert object to string
    localStorage.setItem(this.itemName, dataJSON);    // save item in localstorage
  }

  isReady(): boolean {
    return true;
  }

  isValid(): boolean {
    const appVersion: string[] = environment.VERSION.split('.');
    const configVersion: string[] = this.data.version.split('.');
    return appVersion[0] === configVersion[0] && appVersion[1] === configVersion[1];
  }

  upgrade(): void {
    const assetData: any = this.assetData;
    const storageData: any = this.data;
    Object.entries(assetData).forEach(entry => {
      if (!storageData.hasOwnProperty(entry[0])) {
        storageData[entry[0]] = entry[1];
      }
    })
    this.data = storageData;
  }

  update(values: any): void {
    const data: any = this.data;
    Object.entries(values).forEach(value => data[value[0]] = value[1])
    this.data = data;
  }

  reset(): void {
    localStorage.removeItem(this.itemName)
  }
}
