import { useEffect } from 'react';
import { useCommands, useEditorEvent, useHelpers } from '@remirror/react';

interface ContextAccessorProps {
  markdown: string;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const ContextAccessor = ({ markdown, onBlur, onFocus }: ContextAccessorProps) => {
  const commands = useCommands();
  const helpers = useHelpers();

  useEditorEvent('blur', onBlur ?? (() => undefined));
  useEditorEvent('focus', onFocus ?? (() => undefined));

  useEffect(() => {
    // Avoid replacing the current document after every keystroke when the parent
    // stores the serialized Markdown in state. Only sync genuinely external edits.
    if (markdown !== helpers.getMarkdown()) {
      commands.setContent(markdown);
      commands.focus('start');
    }
  }, [markdown, commands, helpers]);

  return null;
};
