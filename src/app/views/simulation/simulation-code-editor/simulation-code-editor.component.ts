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
  ) { }

  ngOnInit() {
  }

  copyCode(): void {
    let selBox = document.createElement('textarea');
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
    this.code.generate(this.selected);
  }
}
