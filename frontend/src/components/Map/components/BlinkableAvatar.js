import { Avatar } from "./Avatar";
import styled from "styled-components/macro";

const BlinkableAvatar = styled(Avatar)`
  /***** background-color is for testing only; will change when real spacehip avatars are available */
  background-color: black;

  animation: ${(props) =>
    props.isBlink ? "blinkShip 2s steps(1) infinite" : "none"};

  @keyframes blinkShip {
    from {
      filter: none;
    }
    50% {
      filter: invert(100%);
    }
  }
`;

export { BlinkableAvatar };
