// ConsolaWrapper.tsx

import React from 'react';
import Consola from '../consola/Consola';
import { useConsola } from '../context/ConsolaContext';

const ConsolaWrapper: React.FC = () => {
    const { mensajes } = useConsola();

    return (
        <div className="consola">
            <Consola mensajes={mensajes} />
        </div>
    );
}

export default ConsolaWrapper;
