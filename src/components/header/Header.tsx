import React from "react";
import { Segment, Header as SemanticHeader } from "semantic-ui-react";

function Header() {
  return (
    <Segment inverted style={{ backgroundColor: "#6EC4DB", padding: "20px 0" }}>
      <SemanticHeader as="h1" textAlign="center" style={{ color: "white" }}>
        Simulador Algoritmo Hash
      </SemanticHeader>
    </Segment>
  );
}

export default Header;
