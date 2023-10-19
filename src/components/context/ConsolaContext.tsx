// ConsolaContext.tsx
import React, { createContext, useContext, useState } from 'react';
import Consola from '../consola/Consola';

interface ConsolaContextType {
    mensajes: { mensaje: string, numero?: number }[];
    enviarMensaje: (mensaje: string, numero?: number) => void;
}

const ConsolaContext = createContext<ConsolaContextType | undefined>(undefined);

export const ConsolaProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [mensajes, setMensajes] = useState<{ mensaje: string, numero?: number }[]>([]);

    const enviarMensaje = (mensaje: string, numero?: number) => {
        setMensajes(prev => {
            const nuevosMensajes = [...prev, { mensaje, numero }];
            //console.log("Mensajes actuales:", nuevosMensajes);
            return nuevosMensajes;
        });
    }

    return (
        <ConsolaContext.Provider value={{ mensajes, enviarMensaje }}>
            {children}
            {/* <Consola mensajes={mensajes} /> */}
        </ConsolaContext.Provider>
    );
}

export const useConsola = (): ConsolaContextType => {
    const context = useContext(ConsolaContext);
    if (!context) {
        throw new Error('useConsola debe ser usado dentro de un ConsolaProvider');
    }
    return context;
};

