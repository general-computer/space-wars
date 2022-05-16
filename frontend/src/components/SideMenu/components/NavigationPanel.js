import { useDispatch } from "react-redux";
import sideMenuSlice from "../../../store/sideMenu/sideMenuSlice";

import Svg1 from "../../../img/arrows/1.svg";
import Svg2 from "../../../img/arrows/2.svg";
import Svg3 from "../../../img/arrows/3.svg";
import Svg4 from "../../../img/arrows/4.svg";
import Svg5 from "../../../img/arrows/5.svg";
import Svg6 from "../../../img/arrows/6.svg";
import Svg7 from "../../../img/arrows/7.svg";
import Svg8 from "../../../img/arrows/8.svg";
import Svg9 from "../../../img/arrows/9.svg";
import styled from "styled-components/macro";

const arrowsSvg = {
  1: Svg1,
  2: Svg2,
  3: Svg3,
  4: Svg4,
  5: Svg5,
  6: Svg6,
  7: Svg7,
  8: Svg8,
  9: Svg9,
};

const buttonOrder = [7, 8, 9, 4, 5, 6, 1, 2, 3];

const Button = styled.button`
  background-image: url(${(props) => props.url});
  background-size: contain;
  background-color: transparent;
  border: none;

  &:hover {
    transform: translate(0.1rem, -0.1rem);
  }

  &:hover:active {
    transform: none;
  }
`;

const Grid = styled.div`
  width: 10rem;
  height: 10rem;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 0.5rem;
`;

export default function NavigationPanel() {
  const dispatch = useDispatch();

  const clickBtn = (button) => {
    dispatch(sideMenuSlice.actions.tryMove(button));
  };
  return (
    <Grid>
      {buttonOrder.map((button) => (
        <Button
          url={arrowsSvg[button]}
          key={button}
          onClick={() => {
            clickBtn(button);
          }}
        />
      ))}
    </Grid>
  );
}
