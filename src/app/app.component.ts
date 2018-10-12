import {
  Component,
  OnInit
} from '@angular/core'

import {
  faBars,
} from '@fortawesome/free-solid-svg-icons';

import { ConfigService } from './shared/services/config/config.service'
import { SimulationService } from './shared/services/simulation/simulation.service'
import { MathService } from './shared/services/math/math.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public faBars = faBars;

  constructor(
    public _configService: ConfigService,
    public _simulationService: SimulationService,
    public _mathService: MathService,
  ) {
  }

  ngOnInit() {
    this._configService.init()
    window['math'] = this._mathService;
  }

}
