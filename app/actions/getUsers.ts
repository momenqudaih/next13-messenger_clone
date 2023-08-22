import prisma from '@/app/libs/prismadb';

import getSession from './getSession';

const getUsers = async () => {
    const session = await getSession();

    if (!session?.user?.email) {
        return []; // here we will not throw an error, because this is an server action not an api route, so it will crush the server if we throw an error.
    }

    try {
        // Get all users except the current user
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                NOT: {
                    email: session.user.email,
                },
            },
        });

        return users;
    } catch (error: any) {
        return [];
    }
};

export default getUsers;
