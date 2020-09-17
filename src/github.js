import { EMPTY, fromEvent } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

export function ghContent() {
  return `
    <div class="input-field">
        <input id="input" type="text">
        <label for="input">Github user</label>
    </div>

    <div class="row">
        <div id="result" class="col s4"></div>
    </div>
  `;
}

export function getGhStream() {
  const cleanSearch = (element) => {
    element.innerHTML = '';
  };
  const apiURL = 'https://api.github.com/search/users?q=';
  const input = document.querySelector('#input');
  const result = document.querySelector('#result');
  cleanSearch(result);
  input.value = '';

  return fromEvent(input, 'input')
    .pipe(
      map(event => event.target.value),
      debounceTime(1000),
      distinctUntilChanged(),
      tap(searchQuery => {
        cleanSearch(result);
      }),
      filter(searchQuery => searchQuery.trim()),
      switchMap(searchQuery => ajax
        .getJSON(apiURL + searchQuery)
        .pipe(catchError(e => EMPTY))),
      map(data => data.items),
      mergeMap(user => user),
      tap(user => updateCardContent(user, result)),
    );
}

function updateCardContent(user, node) {
  const card = `
    <div class="card">
      <div class="card-image">
        <img src="${user.avatar_url}" alt="">
        <span class="card-panel indigo lighten-4 card-title indigo darken-2">${user.login}</span>
      </div>
      <div class="card-action">
        <a href="${user.html_url}">Github profile ${user.login}</a>
      </div>
    </div>
    `;

  node.insertAdjacentHTML('beforeend', card);
}


