import { Component, OnInit, Input } from '@angular/core';
import CodeMirror from 'codemirror';

import { ProjectCode } from '../../../components/project/projectCode';


@Component({
  selector: 'app-simulation-code-editor',
  templateUrl: './simulation-code-editor.component.html',
  styleUrls: ['./simulation-code-editor.component.scss']
})
export class SimulationCodeEditorComponent implements OnInit {
  @Input() code: ProjectCode;
  private _options: any;

  constructor() {
    this._options = {
      cursorBlinkRate: 700,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      hintOptions: {
        completeSingle: false,
        hintWords: []
      },
      lineNumbers: true,
      lineWrapping: true,
      mode: 'python',
      styleActiveLine: true,
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        '"."': this.showHint,
      }
    };
  }

  ngOnInit() {
  }

  get options(): any {
    return this._options;
  }

  copyCode(): void {
    const selBox: any = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.code.script;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  showHint(cm) {
    // https://stackoverflow.com/questions/41953077/codemirror-editor-show-hint-after-specific-key-pattern-like
    const currentCursorPosition: any = cm.getCursor();
    cm.replaceRange('.', currentCursorPosition);
    const backwardCursorPosition: any = {
      line: currentCursorPosition.line,
      ch: currentCursorPosition.ch - 4
    };
    const backwardCharacter: string = cm.getRange(backwardCursorPosition, currentCursorPosition);
    if (backwardCharacter === 'nest') {
      cm.showHint();
    }
  }
}
