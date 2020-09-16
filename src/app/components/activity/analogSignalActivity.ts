// import { Config } from '../config';
import { Activity } from './activity';
import { Node } from '../node/node';


export class AnalogSignalActivity extends Activity {

  constructor(
    recorder: Node,
    activity: any = {
      events: {
        senders: [],
        times: [],
        V_m: []
      },
      nodeIds: [],
      nodePositions: []
    }
  ) {
    super(recorder, activity);
  }

}
