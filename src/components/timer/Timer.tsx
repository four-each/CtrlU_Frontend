import { css } from "@emotion/react";
import useTimer from "@hooks/useTimer";
import { colors } from "@styles/theme";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { Col } from "@components/common/flex/Flex";
import styled from "@emotion/styled";
import Txt from "@components/common/Txt";
import { ForwardedRef, useImperativeHandle } from "react";

export type FinishHandler = {
  setFinished: () => void;
};

type TimerProps = {
  durationTime: number; // 타이머의 총 시간 (밀리초 단위)
  endTime: string; // 타이머 종료 시간 (HH:MM:SS 형식)
  timerRef?: ForwardedRef<FinishHandler>;
};

export default function Timer({ durationTime, endTime, timerRef }: TimerProps) {
  const { displayTime, percentage, isFinished, setIsFinished, isOver, reset } =
    useTimer({
      durationTime: durationTime,
      endTime: endTime,
    });

  const finishHandler = {
    setFinished: () => {
      setIsFinished(true);
      reset();
    },
  };
  useImperativeHandle(timerRef, () => finishHandler);

  return (
    <Col gap={40} justify="center" align="center">
      <Col
        css={css`
          max-width: 300px;
        `}
      >
        <CircularProgressbarWithChildren
          value={percentage}
          strokeWidth={7}
          styles={{
            path: {
              // 원형 진행 표시바에 그라데이션을 적용
              stroke: "url(#gradient)", // 정의한 그라데이션을 사용
              strokeLinecap: "round", // 라운드 끝 모양
            },
            trail: {
              stroke: colors.gray, // 진행되지 않은 부분의 색
            },
          }}
          css={css`
            box-shadow: 0px 0px 10px 2px
              ${isOver ? "rgb(208, 36, 36, 0.6)" : "rgb(131, 44, 197, 0.6)"};
            border-radius: 50%;
          `}
        >
          <img
            css={css`
              width: 84%;
              margin-top: -9px;
            `}
            src="/src/assets/icons/default.png"
            alt="mainImage"
          />
          <Percent isOver={isOver}>{isOver ? `🚨` : `${percentage}%`}</Percent>
        </CircularProgressbarWithChildren>
        {/* 그라데이션 정의 */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="10%" y2="100%">
              <stop offset="0%" stopColor="white" />
              <stop
                offset="100%"
                stopColor={isOver ? colors.red : colors.purple3}
              />
            </linearGradient>
          </defs>
        </svg>
      </Col>
      <Col gap={10} align="center">
        <ChallengeTimeBox>
          <Txt
            fontSize="1.4rem"
            fontWeight={400}
            color={colors.textBlack}
            letterSpacing="0.1%"
            textAlign="center"
          >
            목표 시간: {endTime}
          </Txt>
        </ChallengeTimeBox>
        <Txt
          fontSize="6rem"
          fontWeight={500}
          color={
            isFinished ? colors.purple3 : isOver ? colors.red : colors.textBlack
          }
          letterSpacing="0.06rem"
          textAlign="center"
        >
          {displayTime}
        </Txt>
      </Col>
    </Col>
  );
}

const Percent = styled.div<{ isOver: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: ${({ isOver }) => (isOver ? "1.6rem" : "0.9rem")};
  font-weight: 700;
  color: ${colors.textBlack};
  text-align: center;
  width: 30px;
  height: 30px;
  color: white;
  background-color: ${({ isOver }) => (isOver ? colors.red : colors.purple3)};
  border-radius: 50%;
  z-index: 1;
`;

const ChallengeTimeBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 2.4rem;
  background-color: ${colors.purple1};
  border-radius: 50px;
`;
