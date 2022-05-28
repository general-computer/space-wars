import styled, { css } from "styled-components/macro";

export default styled.div`
  align-self: stretch;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 1rem;

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
