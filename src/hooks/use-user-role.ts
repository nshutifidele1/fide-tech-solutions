
'use client';

import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore, useUser } from '@/firebase';

export function useUserRole() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const roleDocRef = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user?.uid]);

  const { data: roleDoc, isLoading: isRoleLoading } = useDoc(roleDocRef);

  const isAdmin = !!roleDoc;

  return {
    user,
    isAdmin,
    isLoading: isUserLoading || isRoleLoading,
  };
}
