import styled from "styled-components/macro";
import { Spinner } from "react-bootstrap";

const LoadingText = styled.span`
  padding-right: 1rem;
`;

export default function LoadingMap() {
  return (
    <>
      <LoadingText className={`h1 text-light`}>Map Loading...</LoadingText>
      <Spinner animation="border" role="status" variant="light">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </>
  );
}
