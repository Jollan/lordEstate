import { forOwn, fromPairs, pickBy, toPairs, upperFirst } from "lodash-es";
import { Post } from "../models/post.model";
import { DropdownItemProps } from "semantic-ui-react";

export const rctClass = (obj: { [klass: string]: any }) => {
  const classes: string[] = [""];
  for (const klass in obj) {
    if (obj.hasOwnProperty(klass)) {
      if (obj[klass]) {
        classes.push(klass);
      }
    }
  }
  return classes.join(" ");
};

export const removeExtraWhiteSpace = (value: string) => {
  return value
    .split(" ")
    .filter((sub) => sub.trim())
    .join(" ");
};

export const title = (value: string) => {
  return value
    .split(" ")
    .filter((sub) => sub.trim())
    .map((sub) => upperFirst(sub))
    .join(" ");
};

export function toQuery(params: object) {
  params = sanitize(params);
  let query = "";
  forOwn(params, (value, key) => {
    query = `${query}${query ? "&" : ""}${key}=${value}`;
  });

  return query;
}

export const sanitize = <T extends object>(obj: T) => {
  const pairs = toPairs(obj).map(([key, value]) => [
    key,
    typeof value === "string" && removeExtraWhiteSpace(value),
  ]);
  const object = fromPairs(pairs);
  return pickBy(object, (value) => value);
};

export const text = (options: DropdownItemProps[], value?: string) => {
  return options.filter((opt) => opt.value === value).at(0)?.text;
};

export const isPostSaved = (
  post: Post & { saved?: boolean },
  userId?: string
) => {
  return (
    post.saved ??
    (userId && post.savedPosts?.some((post) => post.userId === userId))
  );
};

export const isOwnerPost = (post: Post, userId?: string) => {
  return post.userId === userId;
};