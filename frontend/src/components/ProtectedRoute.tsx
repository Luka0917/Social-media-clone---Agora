import { Navigate, Outlet } from 'react-router';
import { authClient } from '../lib/auth-clients';

export default function ProtectedRoute(){
    const { data: session, isPending } = authClient.useSession();

    if(isPending) return null;
    if(!session) return <Navigate to='/auth' replace />;

    return <Outlet />;
}