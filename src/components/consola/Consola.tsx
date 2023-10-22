import React, { useEffect, useRef } from "react";
import "./Consola.css";

interface ConsolaProps {
  mensajes: { mensaje: string; numero?: number }[];
}

const Consola: React.FC<ConsolaProps> = (props) => {
  console.log("Mensajes en Consola:", props);

  // Crear la referencia para el último mensaje
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Cuando los mensajes cambien, mueve el scroll hacia el último mensaje
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.mensajes]);

  // Las reglas de transformación <n> Negrita, <b> Blue, <r> Red, <g> Green
  const rules = [
    { regex: /<n(.*?)>/g, replacement: "<strong>$1</strong>" },
    {
      regex: /<b(.*?)>/g,
      replacement:
        '<strong><span style="color: #6EC4DB; font-weight: bold;">$1</span></strong>',
    },
    {
      regex: /<r(.*?)>/g,
      replacement:
        '<strong><span style="color: #FA7C92; font-weight: bold;">$1</span></strong>',
    },
    {
      regex: /<g(.*?)>/g,
      replacement:
        '<strong><span style="color: #66AB8C; font-weight: bold;">$1</span></strong>',
    },
  ];

  const transformMessage = (message: string) => {
    let transformedMessage = message;
    for (const rule of rules) {
      transformedMessage = transformedMessage.replace(
        rule.regex,
        rule.replacement
      );
    }
    return { __html: transformedMessage };
  };

  return (
    <div className="console-wrapper">
      <div className="console-header">Animation Console</div>
      <div className="console-content">
        {props.mensajes.map((mensajeObj, index) => (
          <p
            key={index}
            className={
              index === props.mensajes.length - 1
                ? "last-message-highlight"
                : ""
            }
            dangerouslySetInnerHTML={transformMessage(mensajeObj.mensaje)}
          />
        ))}
        <div ref={endOfMessagesRef}></div>
      </div>
    </div>
  );
};

export default Consola;
