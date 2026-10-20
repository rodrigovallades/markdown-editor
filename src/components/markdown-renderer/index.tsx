import { Box } from '@mui/material';
import { MarkdownEditor } from '../remirror';

export interface MarkdownRendererProps {
  markdown: string;
  placeholder?: string;
}

export const MarkdownRenderer = ({ markdown, placeholder = '' }: MarkdownRendererProps) => (
  <Box sx={{ '&& > *:last-child': { mb: 0 } }}>
    <MarkdownEditor editable={false} markdown={markdown} placeholder={placeholder} />
  </Box>
);
