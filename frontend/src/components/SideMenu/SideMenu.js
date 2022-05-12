import { useDispatch, useSelector } from "react-redux";
import mapSlice from "../../store/shipInfo/shipInfoSlice";

import CloseButton from "../UI/CloseButton";
import ShipInfo from "./ShipInfo";
import cl from "./SideMenu.module.css";

export default (function () {
  const dispatch = useDispatch();
  const menuType = useSelector((state) => state.shipInfo.menuType);
  /******************  For debug */
  console.log(menuType);

  const handleClose = () => {
    dispatch(mapSlice.actions.clickShip(null));
  };

  return (
    <section className={cl.popup}>
      <CloseButton className={cl.closeBtn} onClick={handleClose} />
      {(() => {
        switch (menuType) {
          case "info":
            return <ShipInfo />;
          default:
            return;
        }
      })()}
    </section>
  );
});
