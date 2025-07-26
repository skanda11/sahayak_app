
'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function TeacherView() {
    useEffect(() => {
        redirect('/dashboard/class');
    }, []);

    return null;
}
