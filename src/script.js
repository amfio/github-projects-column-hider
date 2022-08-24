let lastFilterValue = '';

function poll() {
  const filterElement = document.querySelector('[data-test-id="tokenized-query"]');
  const boardElement = document.querySelector('[data-test-id="board-view"]');
  if (!filterElement || !boardElement) {
    lastFilterValue = '';
    return;
  }
  const newFilterValue = filterElement.textContent;

  if (lastFilterValue !== newFilterValue && filterElement.children.length) {
    lastFilterValue = newFilterValue;
    handleFilterChange(filterElement, boardElement);
  }
}

function handleFilterChange(filterElement, boardElement) {
  const statusHidelist = Array
    .from(filterElement.children).map(keyValueElement => (keyValueElement.children.length === 2 && {
      key: keyValueElement.children[0].textContent,
      value: keyValueElement.children[1].textContent,
    }))
    .filter(keyValue => keyValue && keyValue.key === '-status:')
    .map(keyValue => keyValue.value.split(',')) // TODO: make less naive
    .reduce((all, current) => {
      all.push(...current);
      return all;
    }, [])
    .map(status => status.replace(/^"/, '').replace(/"$/, ''));


  Array.from(boardElement.children).forEach(columnElement => {
    const attr = columnElement.attributes['data-board-column'];
    
    if (!attr) {
      return;
    }

    const columnName = attr.value;

    if (columnName === 'No Status') {
      return;
    }

    if (statusHidelist.indexOf(columnName) !== -1 && !columnElement.classList.contains('hidden')) {
      columnElement.classList.add('hidden');
    } else if (statusHidelist.indexOf(columnName) === -1 && columnElement.classList.contains('hidden')) {
      columnElement.classList.remove('hidden');
    }
  });
}

setInterval(poll, 300);
poll();
