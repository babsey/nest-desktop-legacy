import { Component, OnInit } from '@angular/core';
import CodeMirror from 'codemirror';

import { SimulationService } from '../services/simulation.service';
import { SimulationCodeService } from './simulation-code.service';

import { Data } from '../../classes/data';


@Component({
  selector: 'app-simulation-code-editor',
  templateUrl: './simulation-code-editor.component.html',
  styleUrls: ['./simulation-code-editor.component.scss']
})
export class SimulationCodeEditorComponent implements OnInit {
  public selected: string[] = ['kernel', 'models', 'nodes', 'connections', 'events'];
  public blocks: string[] = ['kernel', 'models', 'nodes', 'connections', 'events'];
  public options: any = {
    cursorBlinkRate: 700,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    hintOptions: {
      completeSingle: false,
      hintWords: ['Babsey']
    },
    lineNumbers: true,
    lineWrapping: true,
    mode: 'python',
    styleActiveLine: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      "'.'": this.showHint,
    }
  };

  constructor(
    private _simulationCodeService: SimulationCodeService,
    public _simulationService: SimulationService,
  ) { }

  ngOnInit(): void {
  }

  copyCode(): void {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this._simulationService.code;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  showHint(cm) {
    // https://stackoverflow.com/questions/41953077/codemirror-editor-show-hint-after-specific-key-pattern-like
    var currentCursorPosition = cm.getCursor();
    cm.replaceRange('.', currentCursorPosition);
    var backwardCursorPosition = {
      line: currentCursorPosition.line,
      ch: currentCursorPosition.ch - 4
    };
    var backwardCharacter = cm.getRange(backwardCursorPosition, currentCursorPosition);
    if (backwardCharacter === 'nest') {
      cm.showHint()
    }
  }

  onChange(event) {
    this.selected = event.value;
    this._simulationService.code = this._simulationCodeService.generate(this._simulationService.data, this.selected);
  }
}
