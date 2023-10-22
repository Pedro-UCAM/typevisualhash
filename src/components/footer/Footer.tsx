import React from "react";
import { Container, Segment } from "semantic-ui-react";

function Footer() {
  return (
    <Segment
      inverted
      style={{
        backgroundColor: "#ecececf0",
        marginTop: "20px",
        padding: "20px 0",
      }}
    >
      <Container textAlign="center">
        <p style={{ color: "black" }}>
          Copyright © 2023 – Universidad Católica San Antonio de Murcia
        </p>
        <p style={{ color: "black", fontSize: "0.9em" }}>
          Reservados todos los derechos de autor por las leyes y tratados
          internacionales de propiedad intelectual. Queda expresamente prohibida
          su copia, reproducción o difusión, total o parcial, por cualquier
          medio.
        </p>
      </Container>
    </Segment>
  );
}

export default Footer;
