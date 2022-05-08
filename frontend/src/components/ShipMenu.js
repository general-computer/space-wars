import { useSelector, useDispatch } from "react-redux";
import userInfoSlice from "../store/userInfo/userInfoSlice";

import { Modal, ListGroup, Image } from "react-bootstrap";
import cl from "./ShipMenu.module.css";

export default function ShipMenu() {
  const isChoosingShip = useSelector((state) => state.userInfo.isChoosingShip);
  const walletAddress = useSelector((state) => state.userInfo.walletAddress);
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );
  const shipDataArray = useSelector((state) => state.data.shipDataArray);
  const dispatch = useDispatch();

  // Get all ships of walletAddress
  const shipsOfOwner = [];
  shipDataArray.forEach((ship, index) => {
    if (ship.owner === walletAddress) shipsOfOwner.push(index);
  });

  const handleChooseShip = (event) => {
    const shipIndex = parseInt(event.target.name);
    dispatch(userInfoSlice.actions.confirmShip(shipIndex));
  };

  const handleClose = () => {
    dispatch(userInfoSlice.actions.abortChoosingShip());
  };

  return (
    <Modal
      show={isChoosingShip}
      animation={false}
      centered
      onHide={handleClose}
      className="retro-font"
    >
      <Modal.Header closeButton>
        <Modal.Title>Choose your ship</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {shipsOfOwner.length === 0 ? (
          <h3>You have no ships!</h3>
        ) : (
          <ListGroup>
            {shipsOfOwner.map((shipIndex, key) => (
              <ListGroup.Item
                action
                onClick={handleChooseShip}
                name={shipIndex}
                active={shipIndex === ownerChosenShip}
                className={cl.items + " d-flex align-items-center"}
                key={key}
              >
                <Image
                  src={shipDataArray[shipIndex].avatarString}
                  className={cl.shipImg}
                />
                <span>{shipDataArray[shipIndex].tokenId}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
}
