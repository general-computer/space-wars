import { useDispatch, useSelector } from "react-redux";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";

import CloseButton from "../UI/CloseButton";
import MoveMenu from "./MoveMenu";
import ShipInfo from "./ShipInfo";
import cl from "./SideMenu.module.css";

export default (function () {
  const dispatch = useDispatch();
  const menuType = useSelector((state) => state.sideMenu.menuType);
  /******************  For debug */
  console.log(menuType);

  const handleClose = () => {
    dispatch(sideMenuSlice.actions.clickShip(null));
  };

  return (
    <section className={cl.popup}>
      <CloseButton className={cl.closeBtn} onClick={handleClose} />
      {(() => {
        switch (menuType) {
          case "info":
            return <ShipInfo />;
          case "move":
            return <MoveMenu />;
          default:
            return;
        }
      })()}
    </section>
  );
});
