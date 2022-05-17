import styled, { css } from "styled-components/macro";

const MutableSpan = styled.span`
  ${(props) =>
    props.muted &&
    css`
      color: grey;
    `}
`;

export { MutableSpan };
