'use client';

import useActiveChannel from '../hooks/useActiveChannel';

const ActiveStatus = () => {
    useActiveChannel();
    return <div>ActiveStatus</div>;
};

export default ActiveStatus;
