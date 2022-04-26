import cl from "./Hero.module.css";
import { Container } from "react-bootstrap";

export default function Hero() {
  return (
    <header className={cl.header}>
      <Container>
        <h1>
          <i className="bi bi-clipboard2-minus"></i>Opti-DAO-9000
        </h1>
        <p className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <p className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        </p>
      </Container>
    </header>
  );
}
