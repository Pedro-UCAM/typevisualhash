// ConsolaContext.tsx
import React, { createContext, useContext, useState } from "react";
import Consola from "../consola/Consola";

interface ConsolaContextType {
  mensajes: { mensaje: string; numero?: number }[];
  enviarMensaje: (mensaje: string, numero?: number) => void;
}

const ConsolaContext = createContext<ConsolaContextType | undefined>(undefined);

export const ConsolaProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  interface Message {
    mensaje: string;
    numero?: number;
    index: number;
    color: "white" | "gray";
  }

  const [mensajes, setMensajes] = useState<Message[]>([]);
  const [lastNumero, setLastNumero] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentColor, setCurrentColor] = useState<"white" | "gray">("white");

  const enviarMensaje = (mensaje: string, numero?: number) => {
    setMensajes((prev) => {
      let newColor: "white" | "gray" =
        currentIndex % 2 === 0 ? "gray" : "white";

      const nuevosMensajes = [
        ...prev,
        { mensaje, numero, index: currentIndex, color: newColor },
      ];

      // Si se envía un número y es diferente al anterior, incrementa el índice.
      if (numero !== undefined) {
        setCurrentIndex(currentIndex + 1);
        setLastNumero(numero);
      }

      return nuevosMensajes;
    });
  };

  return (
    <ConsolaContext.Provider value={{ mensajes, enviarMensaje }}>
      {children}
      {/* <Consola mensajes={mensajes} /> */}
    </ConsolaContext.Provider>
  );
};

export const useConsola = (): ConsolaContextType => {
  const context = useContext(ConsolaContext);
  if (!context) {
    throw new Error("useConsola debe ser usado dentro de un ConsolaProvider");
  }
  return context;
};
