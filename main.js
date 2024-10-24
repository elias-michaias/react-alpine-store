import { useState, useEffect } from "react";

const $store = window.Alpine.store;
const $effect = window.Alpine.effect;

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

export const useAlpineStore = (path) => {
  const { parent, key } = walkPath(path);
  const [value, setValue] = useState(parent[key]);

  useEffect(() => {
    $effect(() => {
      setValue(parent[key]);
    });
  }, []);

  useEffect(() => {
    parent[key] = value;
  }, [value]);

  return [value, setValue];
};
