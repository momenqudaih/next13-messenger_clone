import prisma from '@/app/libs/prismadb';
import { Conversation } from '@prisma/client';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
interface IParams {
    conversationId: string;
}

export async function POST(req: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = params;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        seen: true,
                    },
                },
                users: true,
            },
        });

        if (!conversation) {
            return new NextResponse('Conversation not found, Invalid Id', {
                status: 400,
            });
        }

        const LastMessage =
            conversation.messages[conversation.messages.length - 1];

        if (!LastMessage) {
            return NextResponse.json(conversation);
        }

        const updatedMessage = await prisma.message.update({
            where: {
                id: LastMessage.id,
            },
            include: {
                sender: true,
                seen: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
        });

        return NextResponse.json(updatedMessage);
    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGES_SEEN_ROUTE');
        return new NextResponse('Internal server error', { status: 500 });
    }
}
