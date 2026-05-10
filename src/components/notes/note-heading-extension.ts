import { mergeAttributes } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";

const levelClass: Record<number, string> = {
  1: "font-serif text-4xl font-normal text-white mt-6 mb-4",
  2: "note-section-heading font-sans text-2xl font-bold text-white mt-10 mb-3",
  3: "font-sans text-xl font-semibold text-white mt-8 mb-2",
};

/** Allow heading styles in-editor (H1/H2/H3). */
export const NoteHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level as number;
    const tag = `h${level}` as "h1" | "h2" | "h3";
    const cls = levelClass[level] ?? levelClass[3];
    return [tag, mergeAttributes(HTMLAttributes, { class: cls }), 0];
  },
}).configure({ levels: [1, 2, 3] });
