import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bold, Link2, List, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  DESCRIPTION_MAX_LENGTH,
  getDescriptionCharacterCount,
  normalizeDescriptionUrl,
  sanitizeDescriptionHtml,
  toDescriptionEditorHtml,
  convertPlainTextToDescriptionHtml,
} from '@/lib/post-description';

interface PostDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoFocus?: boolean;
  maxLength?: number;
}

interface ToolbarState {
  bold: boolean;
  underline: boolean;
  strikeThrough: boolean;
  unorderedList: boolean;
  link: boolean;
}

const initialToolbarState: ToolbarState = {
  bold: false,
  underline: false,
  strikeThrough: false,
  unorderedList: false,
  link: false,
};

const PostDescriptionEditor: React.FC<PostDescriptionEditorProps> = ({
  value,
  onChange,
  placeholder = 'Describe the opportunity, responsibilities, skills required, and any important details.',
  error,
  autoFocus = false,
  maxLength = DESCRIPTION_MAX_LENGTH,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const lastSyncedValueRef = useRef('');
  const [isEmpty, setIsEmpty] = useState(true);
  const [toolbarState, setToolbarState] = useState<ToolbarState>(initialToolbarState);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [linkError, setLinkError] = useState('');

  const characterCount = useMemo(() => getDescriptionCharacterCount(value), [value]);

  const updateToolbarState = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) {
      setToolbarState(initialToolbarState);
      return;
    }

    const range = selection.getRangeAt(0);
    const withinEditor = editor.contains(range.commonAncestorContainer);
    if (!withinEditor) {
      setToolbarState(initialToolbarState);
      return;
    }

    const anchorElement =
      selection.anchorNode?.nodeType === Node.ELEMENT_NODE
        ? (selection.anchorNode as Element)
        : selection.anchorNode?.parentElement;

    setToolbarState({
      bold: document.queryCommandState('bold'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      link: Boolean(anchorElement?.closest('a')),
    });
  };

  const saveSelection = () => {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return;

    savedRangeRef.current = range.cloneRange();
    updateToolbarState();
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;

    selection.removeAllRanges();
    if (savedRangeRef.current) {
      selection.addRange(savedRangeRef.current);
    }
  };

  const emitChange = (rawHtml: string) => {
    const normalized = sanitizeDescriptionHtml(rawHtml);
    lastSyncedValueRef.current = normalized;
    setIsEmpty(getDescriptionCharacterCount(normalized) === 0);
    onChange(normalized);
  };

  const syncEditorDomToSanitizedHtml = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const normalized = sanitizeDescriptionHtml(editor.innerHTML);
    if (editor.innerHTML !== normalized) {
      editor.innerHTML = normalized;
    }
    lastSyncedValueRef.current = normalized;
    setIsEmpty(getDescriptionCharacterCount(normalized) === 0);
    onChange(normalized);
  };

  const executeCommand = (command: string, commandValue?: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    restoreSelection();
    document.execCommand('styleWithCSS', false, 'false');
    document.execCommand(command, false, commandValue);
    saveSelection();
    emitChange(editor.innerHTML);
    updateToolbarState();
  };

  const handleEditorInput = () => {
    const editor = editorRef.current;
    if (!editor) return;
    emitChange(editor.innerHTML);
    saveSelection();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    const html = event.clipboardData.getData('text/html');
    const text = event.clipboardData.getData('text/plain');
    const content = html ? sanitizeDescriptionHtml(html) : convertPlainTextToDescriptionHtml(text);

    if (!content) return;

    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    restoreSelection();
    document.execCommand('insertHTML', false, content);
    emitChange(editor.innerHTML);
    saveSelection();
  };

  const handleLinkAction = () => {
    if (toolbarState.link) {
      executeCommand('unlink');
      setLinkOpen(false);
      setLinkValue('');
      setLinkError('');
      return;
    }

    saveSelection();
    setLinkError('');
    setLinkOpen(true);
  };

  const applyLink = () => {
    const normalizedUrl = normalizeDescriptionUrl(linkValue);
    if (!normalizedUrl) {
      setLinkError('Please enter a valid link');
      return;
    }

    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    restoreSelection();

    const selection = window.getSelection();
    const hasSelection = selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;

    if (hasSelection) {
      document.execCommand('createLink', false, normalizedUrl);
    } else {
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${normalizedUrl}" target="_blank" rel="noopener noreferrer">${normalizedUrl}</a>`,
      );
    }

    emitChange(editor.innerHTML);
    saveSelection();
    setLinkOpen(false);
    setLinkValue('');
    setLinkError('');
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const nextValue = toDescriptionEditorHtml(value);
    if (lastSyncedValueRef.current === nextValue) return;

    editor.innerHTML = nextValue;
    lastSyncedValueRef.current = nextValue;
    setIsEmpty(getDescriptionCharacterCount(nextValue) === 0);
  }, [value]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !autoFocus) return;

    window.setTimeout(() => {
      editor.focus();
      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      saveSelection();
    }, 0);
  }, [autoFocus]);

  useEffect(() => {
    setIsEmpty(getDescriptionCharacterCount(value) === 0);
  }, [value]);

  useEffect(() => {
    const handleSelectionChange = () => updateToolbarState();
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const toolbarButtonClass = (active: boolean) =>
    cn(
      'h-8 min-w-8 px-2 rounded-md border border-transparent text-sm font-semibold text-foreground transition-colors hover:bg-muted',
      active && 'bg-accent text-accent-foreground hover:bg-accent/90',
    );

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 px-2 py-2">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => executeCommand('bold')}
            className={toolbarButtonClass(toolbarState.bold)}
            aria-label="Bold"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => executeCommand('underline')}
            className={toolbarButtonClass(toolbarState.underline)}
            aria-label="Underline"
            title="Underline"
          >
            <Underline size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => executeCommand('strikeThrough')}
            className={toolbarButtonClass(toolbarState.strikeThrough)}
            aria-label="Strikethrough"
            title="Strikethrough"
          >
            S
          </button>
          <Popover open={linkOpen} onOpenChange={(open) => {
            setLinkOpen(open);
            if (!open) {
              setLinkError('');
              setLinkValue('');
            }
          }}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleLinkAction}
                className={toolbarButtonClass(toolbarState.link)}
                aria-label={toolbarState.link ? 'Remove link' : 'Add link'}
                title={toolbarState.link ? 'Remove link' : 'Add link'}
              >
                <Link2 size={16} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 space-y-3">
              <div className="space-y-1">
                <Label htmlFor="description-link">Link URL</Label>
                <Input
                  id="description-link"
                  value={linkValue}
                  onChange={(event) => {
                    setLinkValue(event.target.value);
                    setLinkError('');
                  }}
                  placeholder="https://example.com"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      applyLink();
                    }
                  }}
                />
                {linkError && <p className="text-xs text-destructive">{linkError}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setLinkOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={applyLink}>
                  Save Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => executeCommand('insertUnorderedList')}
            className={toolbarButtonClass(toolbarState.unorderedList)}
            aria-label="Bullet list"
            title="Bullet list"
          >
            <List size={16} />
          </button>
        </div>

        <div className="relative">
          {isEmpty && (
            <div className="pointer-events-none absolute left-3 top-3 right-3 text-sm leading-6 text-muted-foreground/70">
              {placeholder}
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            dir="ltr"
            className="min-h-[220px] max-h-[320px] overflow-y-auto px-3 py-3 text-sm leading-6 outline-none break-words whitespace-pre-wrap text-left"
            onInput={handleEditorInput}
            onBlur={() => {
              syncEditorDomToSanitizedHtml();
              saveSelection();
            }}
            onFocus={saveSelection}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            onPaste={handlePaste}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className={error ? 'text-destructive' : 'text-muted-foreground'}>
          {error || 'Formatting, links, line breaks, and bullet lists are supported.'}
        </span>
        <span className={characterCount > maxLength ? 'text-destructive' : 'text-muted-foreground'}>
          {characterCount}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default PostDescriptionEditor;
