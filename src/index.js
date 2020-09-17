import { getGhStream, ghContent } from './github';
import { fromEvent } from 'rxjs';
import { canvasContent, getCanvasStream } from './canvas';

window.onload = () => {
  app();
};

function app() {
  let stream$ = null;
  const content = init();

  const ghButton = document.querySelector('#gh-button');
  const canvasButton = document.querySelector('#canvas-button');

  const updateStream = streamFn => {
    if (stream$) {
      stream$.complete();
    }
    stream$ = streamFn();
    stream$.subscribe();
  };

  fromEvent(ghButton, 'click').subscribe(e => {
    content.innerHTML = ghContent();
    updateStream(getGhStream);
  });

  fromEvent(canvasButton, 'click').subscribe(e => {
    content.innerHTML = canvasContent();
    updateStream(getCanvasStream);
  });
}

function init() {
  const content = document.querySelector('#content');
  content.innerHTML = defaultContent();
  return content;
}

function defaultContent() {
  return `
  <h1>RxJS practice.</h1>
  <a id="gh-button" class="waves-effect waves-light btn">Github</a>
  <a id="canvas-button" class="waves-effect waves-light btn">Canvas</a>
`;
}
