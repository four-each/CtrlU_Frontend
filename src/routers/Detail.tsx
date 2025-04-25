import { TrashIcon } from "@assets/icons";
import { Col } from "@components/common/flex/Flex";
import Header from "@components/common/header/Header";
import Txt from "@components/common/Txt";
import styled from "@emotion/styled";
import { colors } from "@styles/theme";

const Detail = () => {
  return (
    <Col>
      <Header
        isBack={true}
        isRight={true}
        rightIcon={<TrashIcon />}
        title="상세"
      />
      <Col
        justify="flex-start"
        align="center"
        width="100%"
        height="100%"
        padding={"50px 0 40px"}
        gap={15}
      >
        <SmallImage src="/src/assets/icons/default.png" alt="Example" />
        <Txt
          fontSize="24px"
          fontWeight={500}
          color={colors.textBlack}
          letterSpacing="0.024px"
        >
          졸업하기
        </Txt>
      </Col>
    </Col>
  );
};

export default Detail;

const SmallImage = styled.img`
  width: 35px;
  height: 35px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  background-color: ${colors.purple1};
  border: 2px solid ${colors.purple1};
`;
