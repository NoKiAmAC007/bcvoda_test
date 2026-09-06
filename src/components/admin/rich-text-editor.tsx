"use client";
import { useRef, useEffect } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3, Link2, RemoveFormatting } from "lucide-react";

/**
 * Легкий WYSIWYG-редактор без залежностей (contentEditable + execCommand).
 * value — HTML-рядок, onChange віддає HTML. Відображення на сайті через formatContent().
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Текст...",
  minHeight = 140,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef<string>("");

  // Початковий вміст + зовнішні скидання (напр. очистка форми після збереження)
  useEffect(() => {
    const el = ref.current;
    if (el && value !== el.innerHTML && value !== last.current) {
      el.innerHTML = value;
      last.current = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emit = () => {
    const html = ref.current?.innerHTML || "";
    last.current = html;
    onChange(html);
  };

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
  };

  const addLink = () => {
    const url = window.prompt("URL посилання:", "https://");
    if (url) exec("createLink", url);
  };

  const Btn = ({
    title,
    onAction,
    children,
  }: {
    title: string;
    onAction: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onAction}
      className="h-8 min-w-8 px-1.5 rounded-lg grid place-items-center text-[#49454F] hover:bg-black/[0.06] hover:text-[#0B57D0] transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="mt-1 rounded-xl border border-black/[0.06] overflow-hidden focus-within:ring-2 focus-within:ring-[#0B57D0]/20 focus-within:border-[#0B57D0] bg-white">
      <style>{`
        .rte-area:empty:before { content: attr(data-placeholder); color: #86868B; pointer-events: none; }
        .rte-area h2 { font-size: 17px; font-weight: 700; margin: 8px 0 4px; }
        .rte-area h3 { font-size: 15px; font-weight: 700; margin: 8px 0 4px; }
        .rte-area ul { list-style: disc; padding-left: 22px; margin: 4px 0; }
        .rte-area ol { list-style: decimal; padding-left: 22px; margin: 4px 0; }
        .rte-area a { color: #0B57D0; text-decoration: underline; }
        .rte-area p { margin: 4px 0; }
      `}</style>
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-black/[0.06] bg-[#F8FAFC]">
        <Btn title="Жирний" onAction={() => exec("bold")}><Bold className="h-4 w-4" /></Btn>
        <Btn title="Курсив" onAction={() => exec("italic")}><Italic className="h-4 w-4" /></Btn>
        <Btn title="Підкреслений" onAction={() => exec("underline")}><Underline className="h-4 w-4" /></Btn>
        <span className="w-px h-5 bg-black/10 mx-1" />
        <Btn title="Заголовок" onAction={() => exec("formatBlock", "h2")}><Heading2 className="h-4 w-4" /></Btn>
        <Btn title="Підзаголовок" onAction={() => exec("formatBlock", "h3")}><Heading3 className="h-4 w-4" /></Btn>
        <span className="w-px h-5 bg-black/10 mx-1" />
        <Btn title="Маркований список" onAction={() => exec("insertUnorderedList")}><List className="h-4 w-4" /></Btn>
        <Btn title="Нумерований список" onAction={() => exec("insertOrderedList")}><ListOrdered className="h-4 w-4" /></Btn>
        <span className="w-px h-5 bg-black/10 mx-1" />
        <Btn title="Посилання" onAction={addLink}><Link2 className="h-4 w-4" /></Btn>
        <Btn title="Прибрати форматування" onAction={() => exec("removeFormat")}><RemoveFormatting className="h-4 w-4" /></Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        className="rte-area px-4 py-3 text-[13px] leading-relaxed outline-none overflow-y-auto"
        style={{ minHeight }}
      />
    </div>
  );
}
