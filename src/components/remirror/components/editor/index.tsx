import { Box } from '@mui/material';
import {
  ThemeProvider as RemirrorThemeProvider,
  useRemirrorContext,
} from '@remirror/react';

export const EditorComponent = () => {
  const ctx = useRemirrorContext();
  const isEditing = ctx.view.editable;
  const { getRootProps } = useRemirrorContext();
  const { key: _key, ...props } = { ...getRootProps() };

  return (
    <RemirrorThemeProvider>
      <Box
        {...props}
        className="remirror-editor-wrapper"
        sx={(theme) => ({
          '&&': {
            p: 0,
            '.remirror-editor': {
              borderRadius: 0,
              boxShadow: `0 0 0 1px ${theme.palette.neutral[300]}`,
              margin: '0 1px',
              '&:focus, &:active': { boxShadow: `0 0 0 1px ${theme.palette.neutral[500]}` },
              fontFamily: theme.typography.fontFamily,
              ...(isEditing ? {
                backgroundColor: theme.palette.background.paper,
                maxHeight: 400,
                minHeight: 220,
                overflowY: 'auto',
              } : {
                boxShadow: 'none',
                maxHeight: 'none',
                minHeight: 'auto',
                overflowY: 'visible',
                padding: 0,
                '&:focus, &:active': { boxShadow: 'none' },
              }),
              'input[type="checkbox"]': {
                accentColor: theme.palette.primary.main,
                width: 18,
                height: 18,
              },
              table: {
                backgroundColor: theme.palette.background.paper,
                borderCollapse: 'collapse',
                borderSpacing: 0,
                '&.remirror-table-with-controllers': {
                  marginBottom: theme.spacing(6),
                  marginInline: 'auto',
                  width: '95%',
                  'th, td': { '&:not(.remirror-controllers-toggle)': { padding: theme.spacing(1.5, 2) } },
                },
                '&:not(.remirror-table-with-controllers)': {
                  boxShadow: theme.shadows[1],
                  'th, td': { padding: theme.spacing(2), border: 0, borderBottom: `1px solid ${theme.palette.neutral[300]}` },
                  'tr:last-child': { 'td, th': { borderBottom: 0 } },
                },
                'td, th': { textAlign: 'left' },
                'th p': { fontWeight: theme.typography.fontWeightBold },
              },
              'ol, ul': {
                mt: 0,
                mb: 1,
                li: { marginBottom: theme.spacing(1) },
              },
              a: { color: theme.palette.primary.main, textDecoration: 'underline' },
              hr: { borderColor: theme.palette.neutral[300], outline: 'none' },
              p: { color: theme.palette.text.primary, ...theme.typography.body1 },
              '> *:not(:last-child):not(.remirror-positioner-widget):not(.remirror-table-with-controllers)': {
                marginBottom: theme.spacing(3),
              },
              '.floating-link-toolbar': { zIndex: 1000 },
              '.selection': { backgroundColor: theme.palette.primary.light },
              '.remirror-is-empty:first-of-type::before': {
                fontStyle: 'normal',
                fontSize: theme.typography.body2.fontSize,
                lineHeight: theme.typography.body2.lineHeight,
              },
              '.remirror-table-delete-inner-button': { backgroundColor: theme.palette.error.main },
            },
          },
        })}
      />
    </RemirrorThemeProvider>
  );
};
