import styled, { css } from "styled-components/macro";

export const InfoContainer = styled.div`
  max-width: 90%;
  margin-left: 1rem;

  /* For vertical screens */
  @media (max-aspect-ratio: 4/5) {
    max-width: 50%;
    margin-left: 1rem;
  }
`;

export const SubInfo = styled.p`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.3rem;

  font-size: 1.5rem;
`;
export const SubInfoProp = styled.span`
  ${(props) => (props.warning ? "color: red" : "")}
`;
export const SubInfoValue = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StyledSubInfoSvgValue = styled.span`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;

  & .ptsSvg {
    height: 1.5rem;
  }
`;
export const SubInfoSvgValue = ({ repeats, url }) => {
  return (
    <StyledSubInfoSvgValue>
      {Array(repeats)
        .fill("")
        .map((item, index) => (
          <img src={url} alt="" className="ptsSvg" key={index} />
        ))}
    </StyledSubInfoSvgValue>
  );
};

export default InfoContainer;
