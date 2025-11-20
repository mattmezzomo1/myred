import React from 'react';
import PanicButton from '../components/PanicButton';
import { useAuth } from '../hooks/useAuth';

export default function Layout({ children }) {
    const { currentUser } = useAuth();

    return (
        <div>
            {children}
            {currentUser && <PanicButton userId={currentUser.id} />}
        </div>
    )
}
