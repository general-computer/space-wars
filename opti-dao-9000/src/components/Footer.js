import { Container, Row } from "react-bootstrap";
import cl from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`${cl.footer} text-muted`}>
      <Container>
        <Row className={cl.linkLogos}>
          <a href="https://github.com/sassafrasass/Opti-DAO-9000/">
            <i className="bi bi-github"></i>
          </a>
        </Row>
        <Row className={cl.credits}>
          <span>Created by Accent Menagerie.</span>
        </Row>
      </Container>
    </footer>
  );
}
