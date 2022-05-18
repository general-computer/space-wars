import styled from "styled-components/macro";

const Avatar = styled.div`
  background-image: url(${(props) => props.src});
  background-size: 80%;
  background-repeat: no-repeat;
  background-position: center;

  grid-column: ${(props) => props.x + 1};
  grid-row: ${(props) => props.y + 1};
`;

export { Avatar };
