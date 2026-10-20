import {
  createTheme,
  Divider,
  Stack,
  ThemeProvider,
  useTheme,
} from '@mui/material';
import {
  InsertHorizontalRuleButton,
  RedoButton,
  ToggleBoldButton,
  ToggleBulletListButton,
  ToggleCodeBlockButton,
  ToggleCodeButton,
  ToggleItalicButton,
  ToggleOrderedListButton,
  ToggleStrikeButton,
  ToggleTaskListButton,
  ToggleUnderlineButton,
  UndoButton,
} from '@remirror/react-ui';
import { CreateTableButton } from './create-table-button';
import { HeadingMenu } from './heading-menu';

const MenuDivider = () => <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1 }} />;

export const Toolbar = () => {
  const appTheme = useTheme();
  const menuTheme = createTheme({
    ...appTheme,
    components: {
      ...appTheme.components,
      MuiToggleButton: {
        styleOverrides: {
          root: {
            '&&': {
              padding: 8,
              borderRadius: '50%',
              borderColor: 'transparent',
              '&.Mui-selected': {
                backgroundColor: 'inherit',
                borderColor: 'transparent',
                color: appTheme.palette.secondary.main,
                '&:hover': { backgroundColor: appTheme.palette.neutral[300] },
              },
              '& > svg': { transform: 'scale(1.2)' },
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={menuTheme}>
      <Stack direction="row" gap={0.5} sx={{ alignItems: 'center', overflowX: 'auto' }}>
        <HeadingMenu />
        <ToggleBulletListButton label="Bullet list" />
        <ToggleOrderedListButton label="Ordered list" />
        <ToggleTaskListButton label="Task list" />
        <MenuDivider />
        <ToggleCodeButton label="Code" />
        <ToggleBoldButton label="Bold" />
        <ToggleItalicButton label="Italic" />
        <ToggleStrikeButton label="Strikethrough" />
        <ToggleUnderlineButton label="Underline" />
        <MenuDivider />
        <InsertHorizontalRuleButton label="Insert divider" />
        <CreateTableButton label="Insert table" />
        <ToggleCodeBlockButton />
        <MenuDivider />
        <UndoButton label="Undo" />
        <RedoButton label="Redo" />
      </Stack>
    </ThemeProvider>
  );
};
