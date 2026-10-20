import { useCallback } from 'react';
import { TableExtension } from '@remirror/extension-tables';
import { useActive, useCommands } from '@remirror/react';
import { CommandButton, type CommandButtonProps } from '@remirror/react-ui';

export interface CreateTableButtonProps
  extends Omit<CommandButtonProps, 'commandName' | 'active' | 'enabled' | 'attrs' | 'onSelect'> {}

export const CreateTableButton = (props: CreateTableButtonProps) => {
  const { createTable } = useCommands<TableExtension>();
  const active = useActive<TableExtension>().table();
  const enabled = createTable.enabled() && !active;

  const handleSelect = useCallback(() => {
    if (createTable.enabled()) createTable();
  }, [createTable]);

  return (
    <CommandButton
      {...props}
      disabled={!enabled}
      commandName="createTable"
      enabled={enabled}
      onSelect={handleSelect}
    />
  );
};
