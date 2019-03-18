import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { DataService } from '../../services/data/data.service';
import { NetworkScriptService } from './network-script.service';

@Component({
  selector: 'app-network-script',
  templateUrl: './network-script.component.html',
  styleUrls: ['./network-script.component.css']
})
export class NetworkScriptComponent implements OnInit, OnChanges {
  @Input() id: string;
  public networkScript: string;

  constructor(
    public _dataService: DataService,
    public _networkScriptService: NetworkScriptService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.generateScript()
  }

  generateScript() {
    var data = this._dataService.data;

    var networkScript = '';
    networkScript += 'import nest\n\n';
    networkScript += this._networkScriptService.kernel(data.kernel);
    networkScript += '\n# Create nodes\n';
    data.collections.map(node => {
      networkScript += this._networkScriptService.create(node);
    })
    networkScript += '\n\n# Connect nodes\n';
    data.connectomes.map(link => {
      networkScript += this._networkScriptService.connect(link);
    })
    networkScript += '\n';
    networkScript += this._networkScriptService.simulate(data.simulation.time);

    data.collections.filter(node => node.element_type == 'recorder').map(rec => {
      networkScript += this._networkScriptService.getData(rec)
    })

    this.networkScript = networkScript;
  }

  copyScript() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.networkScript;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
