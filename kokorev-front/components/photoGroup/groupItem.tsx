import { Chip, useDisclosure } from '@heroui/react';
import { Fragment } from 'react';

import { DrawerItem } from './drawerItem';

import { PhotoGroup } from '@/contexts/admin/types';

interface GroupItemProps {
  group: PhotoGroup;
}

export default function GroupItem({ group }: GroupItemProps) {
  const drawerProps = useDisclosure();

  return (
    <Fragment>
      <div
        className="flex flex-col bg-default-700/10 rounded-lg border border-white/20 p-4 cursor-pointer hover:bg-default-600/20 duration-150"
        onClick={drawerProps.onOpen}
      >
        <p className="text-md w-full flex justify-between">
          {group.name}
          <Chip color={group.isPublished ? 'success' : 'default'}>
            {group.isPublished ? 'Опубликовано' : 'Черновик'}
          </Chip>
        </p>
        {group.subtitle && <p className="text-sm">{group.subtitle}</p>}
        {group.description && <p className="text-sm text-wrap">{group.description}</p>}
      </div>
      <DrawerItem {...drawerProps} group={group} />
    </Fragment>
  );
}
