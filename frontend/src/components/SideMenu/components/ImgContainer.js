import styled from "styled-components/macro";

const ImgContainer = styled.div`
  height: 30vh;
  width: 30vh;
  border: 0.1rem solid black;
  margin-bottom: 1rem;

  display: flex;
  justify-content: center;

  & > img {
    height: 100%;
    object-fit: contain;
  }
`;

export default (function ({ src }) {
  return (
    <ImgContainer>
      <img src={src} alt="" />
    </ImgContainer>
  );
});
