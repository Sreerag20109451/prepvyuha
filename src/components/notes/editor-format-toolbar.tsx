"use client";

import type { Editor } from "@tiptap/core";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useEditorState } from "@tiptap/react";
import { ActionModal } from "@/components/ui/action-modal";

type Props = {
  editor: Editor;
};

const fmtBtn =
  "rounded-lg p-2 text-[#A0AEC0] transition-colors hover:bg-white/10 hover:text-white";
const fmtBtnOn =
  "rounded-lg bg-purple-500/25 p-2 text-[#D6BCFA] ring-1 ring-purple-400/40";

export function EditorFormatToolbar({ editor }: Props) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  useEditorState({
    editor,
    selector: (s) => s.transactionNumber,
  });

  const activeHeading = useMemo(() => {
    if (editor.isActive("heading", { level: 1 })) return 1;
    if (editor.isActive("heading", { level: 2 })) return 2;
    if (editor.isActive("heading", { level: 3 })) return 3;
    return 0;
  }, [editor]);

  function openLinkModal() {
    const prev = editor.getAttributes("link").href as string | undefined;
    setLinkValue(prev ?? "https://");
    setLinkOpen(true);
  }

  return (
    <>
      <div
        className="mb-3 flex flex-wrap items-center gap-0.5 border-b border-white/10 pb-3"
        role="toolbar"
        aria-label="Text formatting"
      >
        <button
          type="button"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? fmtBtnOn : fmtBtn}
        >
          <Bold className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? fmtBtnOn : fmtBtn}
        >
          <Italic className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? fmtBtnOn : fmtBtn}
        >
          <Underline className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? fmtBtnOn : fmtBtn}
        >
          <Strikethrough className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          title="Inline code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? fmtBtnOn : fmtBtn}
        >
          <Code className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <span className="mx-1 h-5 w-px bg-white/15" aria-hidden />
        <button
          type="button"
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={activeHeading === 0 ? fmtBtnOn : fmtBtn}
        >
          <span className="text-xs font-semibold">P</span>
        </button>
        <button
          type="button"
          title="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={activeHeading === 1 ? fmtBtnOn : fmtBtn}
        >
          <Heading1 className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={activeHeading === 2 ? fmtBtnOn : fmtBtn}
        >
          <Heading2 className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={activeHeading === 3 ? fmtBtnOn : fmtBtn}
        >
          <Heading3 className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="mx-1 h-5 w-px bg-white/15" aria-hidden />
        <button
          type="button"
          title="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? fmtBtnOn : fmtBtn}
        >
          <List className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          title="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? fmtBtnOn : fmtBtn}
        >
          <ListOrdered className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          title="Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? fmtBtnOn : fmtBtn}
        >
          <Quote className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="mx-1 h-5 w-px bg-white/15" aria-hidden />
        <button
          type="button"
          title="Link"
          onClick={openLinkModal}
          className={editor.isActive("link") ? fmtBtnOn : fmtBtn}
        >
          <LinkIcon className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <ActionModal
        open={linkOpen}
        onOpenChange={setLinkOpen}
        title="Insert link"
        description="Add or edit a link for the current selection."
        actions={[
          {
            label: "Cancel",
            onClick: () => setLinkOpen(false),
          },
          {
            label: "Remove link",
            variant: "danger",
            onClick: () => {
              editor.chain().focus().unsetLink().run();
              setLinkOpen(false);
            },
          },
          {
            label: "Apply",
            variant: "primary",
            onClick: () => {
              const url = linkValue.trim();
              if (!url) return;
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
              setLinkOpen(false);
            },
          },
        ]}
      >
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#A0AEC0]">
          URL
        </label>
        <input
          type="url"
          value={linkValue}
          onChange={(e) => setLinkValue(e.target.value)}
          placeholder="https://"
          className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-500/40"
        />
      </ActionModal>
    </>
  );
}
