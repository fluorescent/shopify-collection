import Url from 'domurl';

const collection = location => {
  let url = new Url(location || window.location.href);

  function updatePath(tags) {
    const base = url.paths().slice(0, 2);
    url.paths([...base, tags]);
  }

  function getHandle() {
    return url.paths()[1];
  }

  function getTags() {
    const paths = url.paths().filter(Boolean);
    return paths[2] ? paths[2].split(' ') : [];
  }

  function getSort() {
    return url.query.sort_by || null;
  }

  function getPage() {
    return Number(url.query.page) || 1;
  }

  return {
    getState() {
      return {
        handle: getHandle(),
        page: getPage(),
        sort_by: getSort(),
        tags: getTags(),
        url: url
          .toString()
          // Encoded works fine but '+' looks nicer
          .replace(/%20/g, '+'),
      };
    },

    addTags(tags, cb) {
      const updated = [...getTags(), ...tags]
        .filter((elem, pos, arr) => arr.indexOf(elem) == pos)
        .join(' ');
      updatePath(updated);
      delete url.query.page;
      return cb(this.getState());
    },

    removeTags(tags, cb) {
      const updated = getTags()
        .filter(tag => !tags.includes(tag))
        .join(' ');
      updatePath(updated);
      delete url.query.page;
      return cb(this.getState());
    },

    setSort(method, cb) {
      url.query.sort_by = method;
      return cb(this.getState());
    },

    clearSort(cb) {
      delete url.query.sort_by;
      return cb(this.getState());
    },

    clearAll(cb) {
      delete url.query.sort_by;
      updatePath('');

      return cb(this.getState());
    },
  };
};

export default collection;
