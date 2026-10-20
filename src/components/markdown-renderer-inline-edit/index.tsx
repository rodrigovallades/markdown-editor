import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { z } from 'zod';
import { MarkdownEditor } from '../remirror';
import { MarkdownRenderer, type MarkdownRendererProps } from '../markdown-renderer';

export enum Modes {
  editing = 'editing',
  pending = 'pending',
  viewing = 'viewing',
}

export interface MarkdownRendererInlineEditProps extends MarkdownRendererProps {
  editable?: boolean;
  onSave?: (value: string) => void | Promise<void>;
  onFocus?: () => void;
  onBlur?: () => void;
  validationSchema?: z.ZodType;
  initialMode?: Modes;
}

const DEFAULT_VALIDATION_SCHEMA = z.string().trim().min(1);

const hasTextSelection = () => window.getSelection()?.type === 'Range';

export const MarkdownRendererInlineEdit = ({
  editable = false,
  onSave,
  onFocus,
  onBlur,
  placeholder,
  markdown,
  validationSchema = DEFAULT_VALIDATION_SCHEMA,
  initialMode = Modes.viewing,
}: MarkdownRendererInlineEditProps) => {
  const [mode, setMode] = useState<Modes>(initialMode);
  const [viewingMarkdown, setViewingMarkdown] = useState(markdown);
  const [draft, setDraft] = useState(markdown);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const isValid = validationSchema.safeParse(draft).success;

  useEffect(() => {
    setViewingMarkdown(markdown);
    setDraft(markdown);
  }, [markdown]);

  const handleDiscard = useCallback(() => {
    if (mode === Modes.editing) setMode(Modes.viewing);
  }, [mode]);

  const handleSave = useCallback(async () => {
    if (mode !== Modes.editing || !isValid) return;

    const value = draft;
    if (!onSave) {
      setViewingMarkdown(value);
      setMode(Modes.viewing);
      return;
    }

    setMode(Modes.pending);
    try {
      await onSave(value);
      setViewingMarkdown(value);
      setMode(Modes.viewing);
    } catch (error) {
      setMode(Modes.editing);
      window.alert('Could not save the Markdown. Please try again.');
      console.error('Markdown save failed', error);
    }
  }, [draft, isValid, mode, onSave]);

  useEffect(() => {
    if (mode !== Modes.editing && mode !== Modes.pending) return;

    const handleOutsideMouseDown = (event: MouseEvent) => {
      if (editorWrapperRef.current?.contains(event.target as Node)) return;
      handleDiscard();
      onBlur?.();
    };

    document.addEventListener('mousedown', handleOutsideMouseDown, true);
    return () => document.removeEventListener('mousedown', handleOutsideMouseDown, true);
  }, [handleDiscard, mode, onBlur]);

  const handleEnterEditMode = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('a') || hasTextSelection()) {
      event.stopPropagation();
      return;
    }

    setDraft(viewingMarkdown);
    setMode(Modes.editing);
  };

  if (!editable || mode === Modes.viewing) {
    return (
      <Box
        onClick={editable ? handleEnterEditMode : undefined}
        sx={editable ? {
          '&:hover': {
            borderRadius: 0,
            backgroundColor: 'neutral.100',
            cursor: 'text',
          },
        } : undefined}
      >
        <MarkdownRenderer markdown={viewingMarkdown} placeholder={placeholder} />
      </Box>
    );
  }

  return (
    <Box ref={editorWrapperRef}>
      <Stack spacing={2}>
        <MarkdownEditor
          markdown={draft}
          editable
          onBlur={onBlur}
          onChange={setDraft}
          onDiscard={handleDiscard}
          onFocus={onFocus}
          onSave={() => { void handleSave(); }}
          placeholder={placeholder}
        />
        <Stack direction="row" spacing={1}>
          <Button
            disabled={!isValid || mode === Modes.pending}
            loading={mode === Modes.pending}
            onClick={(event) => {
              event.stopPropagation();
              void handleSave();
            }}
            variant="contained"
          >
            Save
          </Button>
          <Button
            disabled={mode === Modes.pending}
            onClick={(event) => {
              event.stopPropagation();
              handleDiscard();
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
