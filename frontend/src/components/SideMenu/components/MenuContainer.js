import styled from "styled-components/macro";

export default styled.div`
  height: 100%;
  width: max(400px, 30vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 1rem;

  /* For vertical screens */
  /*   @media (max-aspect-ratio: 4/5) {
    flex-direction: row;
    margin-top: 0;
    padding: 0 1.5rem;
    gap: 1rem;
  } */
`;
