import { useDispatch, useSelector } from "react-redux";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";

import cl from "./SideMenu.module.css";
import CloseButton from "../UI/CloseButton";
import GiveAPMenu from "./GiveAPMenu";
import MoveMenu from "./MoveMenu";
import ShipInfo from "./ShipInfo";
import UpgradeMenu from "./UpgradeMenu";
import AttackMenu from "./AttackMenu";

export default (function () {
  const dispatch = useDispatch();
  const menuType = useSelector((state) => state.sideMenu.menuType);

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
          case "upgrade":
            return <UpgradeMenu />;
          case "giveAP":
            return <GiveAPMenu />;
          case "attack":
            return <AttackMenu />;
          default:
            return;
        }
      })()}
    </section>
  );
});
