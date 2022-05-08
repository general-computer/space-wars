import cl from "./CloseButton.module.css";
import crossSvg from "../img/cross-optimised.svg";

export default function CloseButton({ className, ...attr }) {
  return (
    <button className={cl.closebutton + " " + className} {...attr}>
      <img src={crossSvg} alt="" />
    </button>
  );
}
