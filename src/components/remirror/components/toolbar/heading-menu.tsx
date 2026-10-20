import { useCallback, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Button,
  Chip,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
  type TypographyProps,
} from '@mui/material';
import { useActive, useCommands } from '@remirror/react';
import { HeadingExtension } from 'remirror/extensions';

const HEADING_LEVELS = [1, 2, 3] as const;

const HeadingButton = ({ level, onClick }: { level: number; onClick: (level: number) => void }) => {
  const active = useActive<HeadingExtension>().heading({ level });
  const isParagraph = level === 0;
  const variant = isParagraph ? 'body2' : `h${level}`;

  return (
    <MenuItem selected={active} value={level} onClick={() => onClick(level)}>
      <ListItemText disableTypography>
        <Typography variant={variant as TypographyProps['variant']}>
          {isParagraph ? 'Paragraph' : `Heading ${level}`}
        </Typography>
      </ListItemText>
      <Chip label={`⌘${level}`} sx={{ ml: 3 }} size="small" />
    </MenuItem>
  );
};

export const HeadingMenu = () => {
  const { focus, toggleHeading, convertParagraph } = useCommands();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const enabled = useCommands<HeadingExtension>().toggleHeading.enabled();
  const active = useActive<HeadingExtension>();
  const activeHeading = HEADING_LEVELS.find((level) => active.heading({ level })) ?? 0;

  const handleSelect = useCallback((level: number) => {
    if (level === 0) convertParagraph();
    else if (toggleHeading.enabled({ level })) toggleHeading({ level });
    focus();
    setAnchorEl(null);
  }, [convertParagraph, focus, toggleHeading]);

  return (
    <Box>
      <Button
        disabled={!enabled}
        disableElevation
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        size="medium"
        variant="outlined"
        color="inherit"
        sx={{ borderColor: 'neutral.500', fontWeight: 500, justifyContent: 'space-between', width: 150 }}
      >
        {activeHeading ? `Heading ${activeHeading}` : 'Paragraph'}
      </Button>
      <Menu anchorEl={anchorEl} disablePortal open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuList>
          <HeadingButton level={0} onClick={handleSelect} />
          {HEADING_LEVELS.map((level) => <HeadingButton key={level} level={level} onClick={handleSelect} />)}
        </MenuList>
      </Menu>
    </Box>
  );
};
