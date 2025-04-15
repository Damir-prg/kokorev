import { useEffect } from 'react';

import GroupItem from './groupItem';

import { useAdmin } from '@/contexts/admin/AdminContext';

interface GroupsListProps {
  isPublic?: boolean;
}

export default function GroupsList({ isPublic = false }: GroupsListProps) {
  const { groups, fetchGroups, error } = useAdmin();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  if (error) {
    return <div className="text-center py-8 text-danger">{error}</div>;
  }

  const filteredGroups = isPublic ? groups.filter(group => group.isPublished) : groups;

  if (filteredGroups.length === 0) {
    return <div className="text-center py-8 text-foreground-500">Нет созданных групп</div>;
  }

  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredGroups.map(group => (
        <GroupItem key={group.id} group={group} />
      ))}
    </div>
  );
}
