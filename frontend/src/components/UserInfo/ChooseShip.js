import { useSelector, useDispatch } from "react-redux";
import userInfoSlice from "../../store/userInfo/userInfoSlice";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";

import { Modal, ListGroup, Image } from "react-bootstrap";
import CloseButton from "../UI/CloseButton";
import cl from "./ChooseShip.module.css";

export default function ShipMenu() {
  const walletAddress = useSelector((state) => state.userInfo.walletAddress);
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );
  const shipDataArray = useSelector((state) => state.data.shipDataArray);
  const dispatch = useDispatch();

  // Get DATA of all ships owned by walletAddress, attaching its shipIndex as well
  const shipsOfOwner = [];
  shipDataArray.forEach((shipData, shipIndex) => {
    if (shipData.owner === walletAddress)
      shipsOfOwner.push({ ...shipData, shipIndex });
  });

  const handleChooseShip = (shipIndex) => {
    dispatch(userInfoSlice.actions.confirmShip(shipIndex));
    dispatch(sideMenuSlice.actions.clickShip(shipIndex));
  };

  const handleClose = () => {
    dispatch(userInfoSlice.actions.abortChoosingShip());
  };

  return (
    <Modal
      show={true}
      animation={false}
      centered
      onHide={handleClose}
      className={cl.shipMenu}
    >
      <Modal.Header className="pb-0">
        <Modal.Title as="h2">Choose your ship</Modal.Title>
        <CloseButton onClick={handleClose} />
      </Modal.Header>
      <Modal.Body>
        {shipsOfOwner.length === 0 ? (
          <h3>You have no ships!</h3>
        ) : (
          <ListGroup>
            {shipsOfOwner.map((shipData, key) => (
              <ListGroup.Item
                action
                onClick={() => {
                  handleChooseShip(shipData.shipIndex);
                }}
                name={shipData.shipIndex}
                className={[
                  cl.items,
                  shipData.shipIndex === ownerChosenShip ? cl.activeShip : "",
                  "d-flex align-items-center",
                ].join(" ")}
                key={key}
              >
                <Image src={shipData.avatarString} className={cl.shipImg} />
                <span className="h3 m-0">{shipData.tokenId}</span>
                {shipData.health <= 0 && (
                  <span
                    className={["h5 m-0"].join("")}
                    style={{ color: "red" }}
                  >
                    Destroyed
                  </span>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
}
