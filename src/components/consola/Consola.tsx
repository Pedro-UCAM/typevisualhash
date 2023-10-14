import React from 'react';
import './Consola.css';

interface ConsolaProps {
    mensajes: { mensaje: string, numero?: number }[];
}

const Consola: React.FC<ConsolaProps> = (props) => {
    console.log("Mensajes en Consola:", props);

    // Las reglas de transformación
    const rules = [
        { regex: /<n(.*?)>/g, replacement: '<strong>$1</strong>' },
        { regex: /<b(.*?)>/g, replacement: '<strong><span style="color: blue; font-weight: bold;">$1</span></strong>' },
        { regex: /<r(.*?)>/g, replacement: '<strong><span style="color: red; font-weight: bold;">$1</span></strong>' },
        { regex: /<g(.*?)>/g, replacement: '<strong><span style="color: green; font-weight: bold;">$1</span></strong>' },
        // Puedes añadir más reglas aquí en el futuro
    ];

    const transformMessage = (message: string) => {
        let transformedMessage = message;
        for (const rule of rules) {
            transformedMessage = transformedMessage.replace(rule.regex, rule.replacement);
        }
        return { __html: transformedMessage };
    };

    return (
        <div>
            <div className="console-content">
                {props.mensajes.map((mensajeObj, index) => (
                    <p key={index} dangerouslySetInnerHTML={transformMessage(mensajeObj.mensaje)} />
                ))}
            </div>
        </div>
    );
}

export default Consola;
