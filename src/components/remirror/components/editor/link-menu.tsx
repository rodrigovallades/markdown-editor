import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AddLinkIcon from '@mui/icons-material/AddLink';
import EditIcon from '@mui/icons-material/Edit';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { OutlinedTextFieldProps, PopoverProps } from '@mui/material';
import { Box, Button, Card, Popover, Stack, TextField } from '@mui/material';
import {
  useActive,
  useAttrs,
  useCommands,
  useCurrentSelection,
  useExtension,
  useSelectedText,
} from '@remirror/react';
import { CommandButton, FloatingToolbar } from '@remirror/react-ui';
import type {
  CommandButtonProps,
  FloatingToolbarProps,
} from '@remirror/react-ui';
import { createMarkPositioner, LinkExtension } from 'remirror/extensions';

const useFloatingLinkState = () => {
  const commands = useCommands();
  const selection = useCurrentSelection();
  const selectedText = useSelectedText() ?? '';
  const href = (useAttrs().link()?.href as string) ?? '';
  const extension = useExtension(LinkExtension);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState<string>(selectedText);
  const [editingHref, setEditingHref] = useState<string>(href);
  const [selectionVirtualElement, setSelectionVirtualElement] =
    React.useState<PopoverProps['anchorEl']>(null);

  const updateSelectionVirtualElement = () => {
    const selection = window.getSelection();

    if (!selection || !selectedText) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelectionVirtualElement({
      getBoundingClientRect: () => rect,
      nodeType: 1,
    });
  };

  // A positioner which only shows for links.
  const linkPositioner = useMemo(
    () => createMarkPositioner({ type: 'link' }),
    []
  );

  const onLinkOpen = useCallback(() => {
    window.open(href, extension.options.defaultTarget ?? '_blank');
  }, [extension.options.defaultTarget, href]);

  const onRemoveLink = useCallback(() => {
    commands.removeLink();
    commands.focus();
    setIsEditing(false);
  }, [commands, setIsEditing]);

  const handleUpdatelink = useCallback(() => {
    setIsEditing(false);

    if (editingHref === '') {
      commands.removeLink();
    } else {
      commands.replaceText({
        content: editingText,
      });
      commands.updateLink({ href: editingHref, auto: false });
    }
  }, [setIsEditing, commands, editingHref, editingText, selection]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    commands.emptySelection();
    setSelectionVirtualElement(null);
  }, [commands, setIsEditing]);

  const onEditLink = useCallback(() => {
    if (selection.empty) {
      commands.selectLink();
    }

    setIsEditing(true);
  }, [commands, commands, selection, setIsEditing]);

  useEffect(() => {
    if (isEditing && selectedText) {
      updateSelectionVirtualElement();
    }

    if (!isEditing) {
      setSelectionVirtualElement(null);
    }
  }, [isEditing, selectedText]);

  useEffect(() => {
    setEditingHref(href);
    setEditingText(selectedText);
  }, [href, selectedText]);

  return useMemo(
    () => ({
      editingHref,
      editingText,
      handleCancelEdit,
      handleUpdatelink,
      isEditing,
      linkPositioner,
      onEditLink,
      onLinkOpen,
      onRemoveLink,
      selectionVirtualElement,
      setEditingHref,
      setEditingText,
      setIsEditing,
    }),
    [
      editingHref,
      editingText,
      handleCancelEdit,
      handleUpdatelink,
      isEditing,
      linkPositioner,
      onEditLink,
      onLinkOpen,
      onRemoveLink,
      selectionVirtualElement,
      setEditingHref,
      setEditingText,
      setIsEditing,
    ]
  );
};

interface DelayAutoFocusInput extends Omit<OutlinedTextFieldProps, 'variant'> {
  handleCancel: () => void;
  handleSubmit: () => void;
}

const DelayAutoFocusInput = ({
  autoFocus,
  handleCancel,
  handleSubmit,
  ...rest
}: DelayAutoFocusInput) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [autoFocus]);

  return (
    <TextField
      {...rest}
      color="secondary"
      inputRef={inputRef}
      onKeyDown={(event) => {
        const { code } = event;

        if (code === 'Enter') {
          event.preventDefault();
          handleSubmit();
        }

        if (code === 'Escape') {
          event.preventDefault();
          handleCancel();
        }
      }}
      size="medium"
      slotProps={{
        input: {
          sx: {
            '&&': {
              boxSizing: 'content-box',
            },
          },
        },
      }}
      variant="outlined"
    />
  );
};

interface EditLinkDialogProps {
  editingHref: string;
  setEditingHref: (href: string) => void;
  editingText: string;
  setEditingText: (text: string) => void;
  handleUpdatelink: () => void;
  handleCancelEdit: () => void;
}

const EditLinkDialog = ({
  editingHref,
  editingText,
  handleCancelEdit,
  handleUpdatelink,
  setEditingHref,
  setEditingText,
}: EditLinkDialogProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        handleCancelEdit();
      }
    },
    [handleCancelEdit, wrapperRef]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <Card className="edit-link-dialog-wrapper" elevation={3} ref={wrapperRef}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          gap: 2,
          width: 300,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <DelayAutoFocusInput
            autoFocus
            fullWidth
            handleCancel={handleCancelEdit}
            handleSubmit={handleUpdatelink}
            label="URL do link"
            onChange={(event) => setEditingHref(event.target.value)}
            placeholder="Digite a URL do link"
            value={editingHref}
          />
          <DelayAutoFocusInput
            fullWidth
            handleCancel={handleCancelEdit}
            handleSubmit={handleUpdatelink}
            label="Texto do link"
            onChange={(event) => setEditingText(event.target.value)}
            placeholder="Digite o texto do link"
            value={editingText}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleUpdatelink} variant="contained">
            Salvar
          </Button>
          <Button onClick={handleCancelEdit}>Cancelar</Button>
        </Box>
      </Box>
    </Card>
  );
};

interface CustomFloatingToolbar extends FloatingToolbarProps {
  children: React.ReactNode;
}

const CustomFloatingToolbar = ({
  children,
  positioner,
}: CustomFloatingToolbar) => {
  return (
    <FloatingToolbar
      disablePortal
      sx={{
        zIndex: 100,
        '& > .MuiStack-root': {
          backgroundColor: 'transparent',
          overflow: 'visible',
        },
      }}
      positioner={positioner}
    >
      <Card elevation={3}>
        <Stack direction="row">{children}</Stack>
      </Card>
    </FloatingToolbar>
  );
};

const CustomCommandButton = ({ ...rest }: CommandButtonProps) => {
  return (
    <CommandButton
      {...rest}
      size="medium"
      sx={{
        border: 0,
      }}
    />
  );
};

export const FloatingLinkToolbar = () => {
  const {
    editingHref,
    editingText,
    handleCancelEdit,
    handleUpdatelink,
    isEditing,
    linkPositioner,
    onEditLink,
    onLinkOpen,
    onRemoveLink,
    selectionVirtualElement,
    setEditingHref,
    setEditingText,
    setIsEditing,
  } = useFloatingLinkState();
  const active = useActive();
  const activeLink = active.link();
  const selection = useCurrentSelection();

  const isMultilineSelection = !selection.$from.sameParent(selection.$to);

  const handleOnEditLink = useCallback(() => {
    onEditLink();
  }, [onEditLink]);

  const linkMenuButtons = useMemo(() => {
    if (activeLink) {
      return (
        <>
          <CustomCommandButton
            className="link-menu-button"
            commandName="updateLink"
            enabled
            icon={<EditIcon fontSize="small" />}
            label="Alterar link"
            onSelect={handleOnEditLink}
          />
          <CustomCommandButton
            className="link-menu-button"
            commandName="removeLink"
            enabled
            icon={<LinkOffIcon fontSize="small" />}
            label="Remover link"
            onSelect={onRemoveLink}
          />
          <CustomCommandButton
            commandName="openLink"
            className="link-menu-button"
            enabled
            icon={<OpenInNewIcon fontSize="small" />}
            label="Abrir link"
            onSelect={onLinkOpen}
          />
        </>
      );
    }

    if (!selection.empty) {
      return (
        <>
          <CustomCommandButton
            className="link-menu-button"
            commandName="updateLink"
            enabled
            icon={<AddLinkIcon fontSize="small" />}
            label="Adicionar link"
            onSelect={handleOnEditLink}
          />
        </>
      );
    }

    return <></>;
  }, [activeLink, selection, handleOnEditLink, onRemoveLink, onLinkOpen]);

  return (
    <>
      {!isEditing && !isMultilineSelection && (
        <CustomFloatingToolbar>{linkMenuButtons}</CustomFloatingToolbar>
      )}
      {!isEditing && selection.empty && !isMultilineSelection && (
        <CustomFloatingToolbar positioner={linkPositioner}>
          {linkMenuButtons}
        </CustomFloatingToolbar>
      )}
      {!!selectionVirtualElement && (
        <Popover
          anchorEl={selectionVirtualElement}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom',
          }}
          disablePortal
          onClose={() => setIsEditing(false)}
          open={isEditing}
        >
          <EditLinkDialog
            editingHref={editingHref}
            editingText={editingText}
            handleCancelEdit={handleCancelEdit}
            handleUpdatelink={handleUpdatelink}
            setEditingHref={setEditingHref}
            setEditingText={setEditingText}
          />
        </Popover>
      )}
    </>
  );
};
