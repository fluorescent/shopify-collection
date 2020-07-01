# shopify-collection

[![npm version](https://img.shields.io/npm/v/shopify-collection.svg?style=flat-square)](https://www.npmjs.com/package/shopify-collection)

Utility to parse and update Shopify collection URLs to help handle AJAX tag filtering and sorting. Similar to Liquid's `link_to_add_tag` and `link_to_remove_tag`, but for JavaScript.

## Install

```sh
npm i shopify-collection --save
```

or

```sh
yarn add shopify-collection
```

## Usage

- [Initialize collection](#initialize-collection)
- [Get state](#get-state)
- [Add tags](#add-tags)
- [Remove tags](#remove-tags)
- [Set sort](#set-sort)
- [Clear sort](#clear-sort)
- [Clear all](#clear-all)

### Initialize collection

Only need to initialize a collection once.

```js
import manage from 'shopify-collection';

// Initialize with a url, by default will use `window.location.href`
const collection = manage(URL);
```

### Get state

`getState()`

Return the current state of the collection. Every method also has a callback that returns the value of `getState()`.

```js
// Current url:
// https://store.myshopify.com/collections/tops/color_blue?sort_by=manual

collection.getState();
```

```js
{
  handle: 'tops',
  page: 1,
  sort_by: 'manual',
  tags: ['color_blue'],
  url: 'https://store.myshopify.com/collections/tops/color_blue+color_black?sort_by=manual'
}
```

### Add tags

`addTags([tags], func(state))`

```js
// Current url:
// https://store.myshopify.com/collections/tops/color_blue

collection.addTags(['array_of', 'tag_to', 'add'], state => {});
```

Returned `state`:

```js
{
  handle: 'tops',
  page: 1,
  sort_by: null,
  tags: ['color_blue', 'array_of', 'tags_to', 'add'],
  url: 'https://store.myshopify.com/collections/tops/color_blue+array_of+tags_to+add'
}
```

### Remove Tags

`removeTags([tags], func(state))`

```js
// Current url:
// https://store.myshopify.com/collections/tops/color_blue+size_small+fit_standard

collection.removeTags(['size_small', 'color_blue'], state => {});
```

Returned `state`:

```js
{
  handle: 'tops',
  page: 1,
  sort_by: null,
  tags: ['fit_standard'],
  url: 'https://store.myshopify.com/collections/tops/fit_standard'
}
```

### Set sort

`setSort(method, func(state))`

`method` should be one of `manual`, `best-selling`, `title-ascending`, `title-descending`, `price-ascending`, `price-descending`, `created-ascending`, `created-descending`.

```js
// Current url:
// https://store.myshopify.com/collections/tops/color_blue

collection.setSort('best-selling', state => {});
```

Returned `state`:

```js
{
  handle: 'tops',
  page: 1,
  sort_by: 'best-selling',
  tags: ['color_blue'],
  url: 'https://store.myshopify.com/collections/tops/fit_standard?sort_by=best-selling'
}
```

### Clear sort

`clearSort(func(state))`

```js
// Current url:
// https://store.myshopify.com/collections/tops/color_blue?sort_by=manual

collection.clearSort(state => {});
```

Returned `state`:

```js
{
  handle: 'tops',
  page: 1,
  sort_by: null,
  tags: ['color_blue'],
  url: 'https://store.myshopify.com/collections/tops/fit_standard'
}
```

### Clear all

`clearAll(func(state))`

Remove all active tag filters and sort

```js
// Current url:
// https://store.myshopify.com/collections/tops/color_blue?sort_by=manual

collection.clearSort(state => {});
```

Returned `state`:

```js
{
  handle: 'tops',
  page: 1,
  sort_by: null,
  tags: [],
  url: 'https://store.myshopify.com/collections/tops'
}
```
