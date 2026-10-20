import { useCallback } from 'react';
import { Box } from '@mui/material';
import {
  TableComponents,
  TableExtension as ReactTableExtension,
} from '@remirror/extension-react-tables';
import {
  Remirror,
  useCommands,
  useKeymaps,
  useRemirror,
  type ReactExtensions,
} from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';
import {
  BoldExtension,
  BulletListExtension,
  CodeBlockExtension,
  CodeExtension,
  HeadingExtension,
  HistoryExtension,
  HorizontalRuleExtension,
  ItalicExtension,
  LinkExtension,
  MarkdownExtension,
  OrderedListExtension,
  ParagraphExtension,
  PlaceholderExtension,
  StrikeExtension,
  TableExtension,
  TaskListExtension,
  UnderlineExtension,
} from 'remirror/extensions';
import {
  ContextAccessor,
  EditorComponent,
  FloatingLinkToolbar,
  Toolbar,
} from './components';

interface MarkdownEditorProps {
  editable?: boolean;
  markdown: string;
  onBlur?: () => void;
  onDiscard?: () => void;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onSave?: () => void;
  placeholder?: string;
}

type EditorExtensions = ReactExtensions<
  | BoldExtension
  | BulletListExtension
  | CodeBlockExtension
  | CodeExtension
  | HeadingExtension
  | HistoryExtension
  | HorizontalRuleExtension
  | ItalicExtension
  | LinkExtension
  | MarkdownExtension
  | OrderedListExtension
  | ParagraphExtension
  | PlaceholderExtension
  | ReactTableExtension
  | StrikeExtension
  | TableExtension
  | TaskListExtension
  | UnderlineExtension
>;

export const MarkdownEditor = ({
  editable = true,
  markdown,
  onBlur,
  onDiscard,
  onChange,
  onFocus,
  onSave,
  placeholder,
}: MarkdownEditorProps) => {
  const { manager } = useRemirror<EditorExtensions>({
    ...(editable && { builtin: { persistentSelectionClass: 'selection' } }),
    content: markdown,
    extensions: () => [
      new BoldExtension({}),
      new BulletListExtension({}),
      new CodeBlockExtension({}),
      new CodeExtension({}),
      new HeadingExtension({}),
      new HistoryExtension({}),
      new HorizontalRuleExtension({}),
      new ItalicExtension({}),
      new LinkExtension({ autoLink: true, defaultTarget: '_blank', openLinkOnClick: false }),
      new MarkdownExtension({}),
      new OrderedListExtension({}),
      new ParagraphExtension({}),
      new PlaceholderExtension({ placeholder }),
      editable ? new ReactTableExtension({}) : new TableExtension({}),
      new StrikeExtension({}),
      new TaskListExtension({}),
      new UnderlineExtension({}),
    ],
    selection: 'start',
    stringHandler: 'markdown',
  });

  const hooks = [() => {
    const { convertParagraph, toggleHeading } = useCommands();
    const handleSetHeading = useCallback((level: number) => {
      if (toggleHeading.enabled({ level })) toggleHeading({ level });
    }, [toggleHeading]);

    useKeymaps({
      Escape: () => { onDiscard?.(); return true; },
      'Mod-Enter': () => { onSave?.(); return true; },
      'Mod-0': () => { convertParagraph(); return true; },
      'Mod-1': () => { handleSetHeading(1); return true; },
      'Mod-2': () => { handleSetHeading(2); return true; },
      'Mod-3': () => { handleSetHeading(3); return true; },
      'Mod-4': () => { handleSetHeading(4); return true; },
      'Mod-5': () => { handleSetHeading(5); return true; },
      'Mod-6': () => { handleSetHeading(6); return true; },
    });
  }];

  return (
    <AllStyledComponent>
      <Remirror
        editable={editable}
        hooks={hooks}
        manager={manager}
        onChange={(parameter) => onChange?.(parameter.helpers.getMarkdown())}
      >
        {editable && (
          <>
            <Box mb={2}><Toolbar /></Box>
            <TableComponents enableTableCellMenu={false} />
          </>
        )}
        <EditorComponent />
        {editable && <FloatingLinkToolbar />}
        <ContextAccessor markdown={markdown} onBlur={onBlur} onFocus={onFocus} />
      </Remirror>
    </AllStyledComponent>
  );
};
