import { useState, useEffect } from "react";

const $store = window.Alpine.store;
const $effect = window.Alpine.effect;

exports.useAlpineStore = (path) => {
  const { parent, key } = walkPath(path);
  const [value, setValue] = useState(parent[key]);

  useEffect(() => {
    $effect(() => {
      setValue(parent[key]);
    });
  }, []);

  useEffect(() => {
    if (parent[key] !== value) {
      parent[key] = value;
    }
  }, [value]);

  return [value, setValue];
};

const walkPath = (path) => {
  const parts = path.split(".");
  const firstPart = parts.shift();
  let obj = $store(firstPart);

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }

  return { parent: obj, key: parts[parts.length - 1] };
};
