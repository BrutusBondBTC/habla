import { bech32ToHex, decodeNaddr } from "./encoding";
import { findTag, findTags } from "./tags";

function processContent(ev, replaceTags) {
  const replaceNpub = (match: string) => {
    try {
      const hex = bech32ToHex(match);
      const idx = ev.tags.length;
      ev.tags.push(["p", hex, idx]);
      return `#[${idx}]`;
    } catch (error) {
      return match;
    }
  };
  const replaceNaddr = (match: string) => {
    try {
      const { k, pubkey, d } = decodeNaddr(match);
      const idx = ev.tags.length;
      ev.tags.push(["a", `${k}:${pubkey}:${d}`, idx]);
      return `#[${idx}]`;
    } catch (error) {
      return match;
    }
  };
  const replaceNoteId = (match: string) => {
    try {
      const hex = bech32ToHex(match);
      const idx = ev.tags.length;
      ev.tags.push(["e", hex, idx]);
      return `#[${idx}]`;
    } catch (error) {
      return match;
    }
  };
  const replaceHashtag = (match: string) => {
    const tag = match.slice(1);
    const idx = ev.tags.length;
    ev.tags.push(["t", tag, idx]);
    return `#[${idx}]`;
  };
  const replaced = ev.content
    .replace(/\bnpub1[a-z0-9]+\b(?=(?:[^`]*`[^`]*`)*[^`]*$)/g, replaceNpub)
    .replace(/\bnote1[a-z0-9]+\b(?=(?:[^`]*`[^`]*`)*[^`]*$)/g, replaceNoteId)
    .replace(/\bnaddr1[a-z0-9]+\b(?=(?:[^`]*`[^`]*`)*[^`]*$)/g, replaceNaddr);
  ev.content = replaceTags
    ? replaced.replace(
        /(#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+)/g,
        replaceHashtag
      )
    : replaced;
}

export async function sign(ev, replaceTags = true) {
  processContent(ev, replaceTags);
  return await window.nostr.signEvent(ev);
}

export async function signEvent(ev) {
  return await window.nostr.signEvent(ev);
}

export function getMetadata(ev) {
  const warning = findTag(ev.tags, "content-warning");
  return {
    title: findTag(ev.tags, "title")?.replace("\n", " "),
    d: findTag(ev.tags, "d"),
    image: findTag(ev.tags, "image"),
    summary: findTag(ev.tags, "summary"),
    publishedAt: findTag(ev.tags, "published_at"),
    hashtags: findTags(ev.tags, "t"),
    sensitive: Boolean(warning),
    warning: warning,
  };
}
