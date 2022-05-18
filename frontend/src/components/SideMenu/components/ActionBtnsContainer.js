import styled, { css } from "styled-components/macro";

export default styled.div`
  align-self: stretch;
  display: flex;
  justify-content: space-evenly;

  & button {
    width: 11rem;
  }
  /* For vertical screens */
  /* @media (max-aspect-ratio: 4/5) {
    flex-direction: column;
  } */
`;

export const DimmableSpan = styled.span`
  ${(props) =>
    props.dim &&
    css`
      color: grey;
    `}
`;
