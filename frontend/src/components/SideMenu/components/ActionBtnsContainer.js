import styled from "styled-components/macro";

export default styled.div`
  align-self: stretch;
  display: flex;
  justify-content: space-evenly;

  & button {
    width: 10rem;
  }
  /* For vertical screens */
  @media (max-aspect-ratio: 4/5) {
    flex-direction: column;
  }
`;
