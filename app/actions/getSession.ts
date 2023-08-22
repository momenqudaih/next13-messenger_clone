import { getServerSession } from 'next-auth';

import { authOptions } from '../api/auth/[...nextauth]/route';

async function getSession() {
    return await getServerSession(authOptions);
}

export default getSession;
