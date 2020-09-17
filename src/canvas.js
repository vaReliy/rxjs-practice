import { fromEvent } from 'rxjs';
import { map, pairwise, startWith, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

export function getCanvasStream() {
  const canvas = document.querySelector('#canvas');
  const range = document.querySelector('#range');
  const color = document.querySelector('#color');
  const clearButton = document.querySelector('#clear-button');

  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio;

  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  ctx.scale(scale, scale);

  const createInputStream = node => {
    return fromEvent(node, 'input').pipe(
      map(e => e.target.value),
      startWith(node.value),
    );
  };

  const mouseDown$ = fromEvent(canvas, 'mousedown');
  const mouseMove$ = fromEvent(canvas, 'mousemove');
  const mouseUp$ = fromEvent(canvas, 'mouseup');
  const mouseOut$ = fromEvent(canvas, 'mouseout');
  const clear$ = fromEvent(clearButton, 'click').pipe(
    startWith(null),
    tap(_ => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }),
  );

  const range$ = createInputStream(range);
  const color$ = createInputStream(color);

  return clear$.pipe(
    switchMap(_ => mouseDown$),
    // withLatestFrom(range$, color$, (_, lineWidth, strokeStyle) => {
    withLatestFrom(range$, color$, (mouseDownEvent, lineWidth, strokeStyle) => {
        return {lineWidth, strokeStyle};
    }),
    switchMap(options => mouseMove$.pipe(
      map(e => ({x: e.offsetX, y: e.offsetY, options})),
      pairwise(),
      takeUntil(mouseUp$),
      takeUntil(mouseOut$),
    )),
    tap(([start, end]) => {
      const {lineWidth, strokeStyle} = start.options;

      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }),
  );
}

export function canvasContent() {
  return `
    <canvas id="canvas"></canvas>
    <div class="input-field">
        <input id="range" type="range" class="range" min="1" max="4" value="2">
    </div>
    <div class="input-field">
        <input id="color" type="color">
    </div>
    <a id="clear-button" class="waves-effect waves-light btn">Clear</a>
  `;
}
