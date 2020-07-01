const test = require('ava');
const collection = require('./dist/shopify-collection.js');

const base = `https://some-shopify-store.com/collections`;

test('get proper state when there are no filter tags or sorting', t => {
  const url = `${base}/tops`;
  const c = collection(url);

  t.deepEqual(c.getState(), {
    handle: 'tops',
    page: 1,
    sort_by: null,
    tags: [],
    url: url,
  });
});

test('get proper state when there are only tags', t => {
  const url = `${base}/tops/color_blue+color_black`;
  const c = collection(url);

  t.deepEqual(c.getState(), {
    handle: 'tops',
    page: 1,
    sort_by: null,
    tags: ['color_blue', 'color_black'],
    url: url,
  });
});

test('get proper state when there are filter tags and sorting', t => {
  const url = `${base}/tops/color_blue+color_black?sort_by=manual`;
  const c = collection(url);

  t.deepEqual(c.getState(), {
    handle: 'tops',
    page: 1,
    sort_by: 'manual',
    tags: ['color_blue', 'color_black'],
    url: url,
  });
});

test('add single or multiple tags', t => {
  t.plan(2);

  const c = collection(`${base}/tops/color_blue+color_black?sort_by=manual`);

  c.addTags(['color_pink'], state => {
    t.deepEqual(state, {
      handle: 'tops',
      page: 1,
      sort_by: 'manual',
      tags: ['color_blue', 'color_black', 'color_pink'],
      url: `${base}/tops/color_blue+color_black+color_pink?sort_by=manual`,
    });
  });

  c.addTags(['size_small', 'size_medium'], state => {
    t.deepEqual(state, {
      handle: 'tops',
      page: 1,
      sort_by: 'manual',
      tags: [
        'color_blue',
        'color_black',
        'color_pink',
        'size_small',
        'size_medium',
      ],
      url: `${base}/tops/color_blue+color_black+color_pink+size_small+size_medium?sort_by=manual`,
    });
  });
});

test('remove single or multiple tags', t => {
  const c = collection(
    `${base}/tops/color_blue+color_black+color_pink?sort_by=manual`
  );

  // Remove a single tag
  c.removeTags(['color_blue'], state => {
    t.deepEqual(state, {
      handle: 'tops',
      page: 1,
      sort_by: 'manual',
      tags: ['color_black', 'color_pink'],
      url: `${base}/tops/color_black+color_pink?sort_by=manual`,
    });
  });

  // Remove multiple tags
  c.removeTags(['color_black', 'color_pink'], state => {
    t.deepEqual(state, {
      handle: 'tops',
      page: 1,
      sort_by: 'manual',
      tags: [],
      url: `${base}/tops/?sort_by=manual`,
    });
  });
});

test('set sort method', t => {
  const c = collection(`${base}/tops/color_black`);

  c.setSort('manual', state => {
    t.deepEqual(state, {
      handle: 'tops',
      page: 1,
      sort_by: 'manual',
      tags: ['color_black'],
      url: `${base}/tops/color_black?sort_by=manual`,
    });
  });

  c.setSort('title-descending', state => {
    t.deepEqual(state, {
      handle: 'tops',
      page: 1,
      sort_by: 'title-descending',
      tags: ['color_black'],
      url: `${base}/tops/color_black?sort_by=title-descending`,
    });
  });
});

test('clear sort method', t => {
  const c = collection(`${base}/tops/color_black?sort_by=manual`);

  c.clearSort(state => {
    t.deepEqual(state, {
      handle: 'tops',
      page: 1,
      sort_by: null,
      tags: ['color_black'],
      url: `${base}/tops/color_black`,
    });
  });
});

test('clear all tag filters and sorting method', t => {
  const c = collection(`${base}/tops/color_black+fit_standard?sort_by=manual`);

  c.clearAll(state => {
    t.deepEqual(state, {
      handle: 'tops',
      page: 1,
      sort_by: null,
      tags: [],
      url: `${base}/tops/`,
    });
  });
});

test('returns to first page when adding tag filters', t => {
  const c = collection(
    `${base}/tops/color_black+fit_standard?sort_by=manual&page=3`
  );

  t.deepEqual(c.getState(), {
    handle: 'tops',
    page: 3,
    sort_by: 'manual',
    tags: ['color_black', 'fit_standard'],
    url: `${base}/tops/color_black+fit_standard?sort_by=manual&page=3`,
  });

  c.addTags(['size_small'], state => {
    t.deepEqual(state, {
      handle: 'tops',
      page: 1,
      sort_by: 'manual',
      tags: ['color_black', 'fit_standard', 'size_small'],
      url: `${base}/tops/color_black+fit_standard+size_small?sort_by=manual`,
    });
  });
});

test('returns to first page when removing tag filters', t => {
  const c = collection(
    `${base}/tops/color_black+fit_standard?sort_by=manual&page=3`
  );

  t.deepEqual(c.getState(), {
    handle: 'tops',
    page: 3,
    sort_by: 'manual',
    tags: ['color_black', 'fit_standard'],
    url: `${base}/tops/color_black+fit_standard?sort_by=manual&page=3`,
  });

  c.removeTags(['fit_standard'], state => {
    t.deepEqual(state, {
      handle: 'tops',
      page: 1,
      sort_by: 'manual',
      tags: ['color_black'],
      url: `${base}/tops/color_black?sort_by=manual`,
    });
  });
});
