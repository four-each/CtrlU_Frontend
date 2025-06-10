import { TrashIcon } from "@assets/icons";
import { Col, Row } from "@components/common/flex/Flex";
import Header from "@components/common/header/Header";
import Txt from "@components/common/Txt";
import Timer, { FinishHandler } from "@components/timer/Timer";
import styled from "@emotion/styled";
import { colors } from "@styles/theme";
import { useRef } from "react";

const Detail = () => {
  const isMe = true;
  const finishHandler = useRef<FinishHandler>(null);
  return (
    <Col align="center">
      <Header
        isBack={true}
        isRight={true}
        rightIcon={isMe ? <TrashIcon /> : null}
        title={isMe ? "" : "친구이름"}
      />
      <Col
        justify="flex-start"
        align="center"
        width="100%"
        height="100%"
        padding={"50px 0 40px"}
        gap={15}
      >
        <SmallImage src="/src/assets/icons/default.png" alt="smallImage" />
        <Txt
          fontSize="24px"
          fontWeight={500}
          color={colors.textBlack}
          letterSpacing="0.0024rem"
        >
          졸업하기
        </Txt>
      </Col>
      <Timer
        durationTime={1200000}
        endTime="00:20:05"
        timerRef={finishHandler}
      />
      {isMe && (
        <Row
          justify="center"
          align="center"
          gap={20}
          width="100%"
          padding={"20px 0 44px"}
        >
          <MissionButton buttonType="quit">미션 포기</MissionButton>
          <MissionButton
            buttonType="complete"
            onClick={() => {
              finishHandler.current?.setFinished();
              console.log("미션 완료");
            }}
          >
            미션 완료
          </MissionButton>
        </Row>
      )}
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

const MissionButton = styled.button<{ buttonType: "quit" | "complete" }>`
  padding: 12px 23px 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  font-size: 1.6rem;
  font-weight: 400;
  color: ${({ buttonType }) =>
    buttonType === "quit" ? colors.textBlack : colors.white};
  background-color: ${({ buttonType }) =>
    buttonType === "quit" ? colors.purple1 : colors.purple3};
`;
