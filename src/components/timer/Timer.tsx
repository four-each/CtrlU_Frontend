import { css } from "@emotion/react";
import useTimer from "@hooks/useTimer";
import { colors } from "@styles/theme";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { Col } from "@components/common/flex/Flex";
import styled from "@emotion/styled";
import Txt from "@components/common/Txt";
import { ForwardedRef, useImperativeHandle } from "react";
import ganadiIcon from "../../assets/icons/detail/ganadi.svg";

export type FinishHandler = {
  setFinished: () => void;
};

type TimerProps = {
  durationTime: number; // 타이머의 총 시간 (밀리초 단위)
  challengeTime: string; // 목표 시간 (HH:MM:SS 형식)
  timerRef?: ForwardedRef<FinishHandler>;
  centerImageSrc?: string; // 중앙에 표시될 이미지 URL
  textColor?: string; // 시간 텍스트 색상
};

export default function Timer({ durationTime, challengeTime, timerRef, centerImageSrc, textColor }: TimerProps) {
  const { displayTime, percentage, isFinished, setIsFinished, isOver, reset } =
    useTimer({
      durationTime: durationTime,
      challengeTime: challengeTime,
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
          width: 272px;
          height: 272px;
        `}
      >
        <CircularProgressbarWithChildren
          value={percentage}
          strokeWidth={7}
          styles={{
            path: {
              stroke: "url(#gradient)",
              strokeLinecap: "round",
            },
            trail: {
              stroke: colors.gray,
            },
          }}
          css={css`
            box-shadow: 0px 0px 10px 2px
              ${isOver ? "rgb(208, 36, 36, 0.6)" : "rgb(131, 44, 197, 0.6)"};
            border-radius: 50%;
          `}
        >
          <div
            css={css`
              width: 87%;
              height: 87%;
              margin-top: -9px;
              border-radius: 50%;
              overflow: hidden;
              border: 2px solid #ffffff;
              background-color: #ffffff;
            `}
          >
            <img
              css={css`
                width: 100%;
                height: 100%;
                object-fit: cover;
              `}
              src={centerImageSrc || ganadiIcon}
              alt="mainImage"
            />
          </div>
          <Percent 
            isOver={isOver} 
            percentage={percentage}
          >
            {isOver ? `🚨` : `${percentage}%`}
          </Percent>
        </CircularProgressbarWithChildren>
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
            목표 시간: {challengeTime}
          </Txt>
        </ChallengeTimeBox>
        <Txt
          fontSize="6rem"
          fontWeight={500}
          color={
            isFinished ? colors.purple3 : isOver ? colors.red : (textColor || colors.textBlack)
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

const Percent = styled.div<{ isOver: boolean; percentage: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 30px;
  height: 30px;
  font-size: ${({ isOver }) => (isOver ? "1.6rem" : "0.9rem")};
  font-weight: 700;
  color: white;
  background-color: ${({ isOver }) => (isOver ? colors.red : colors.purple3)};
  border-radius: 50%;
  z-index: 1;
  
  ${({ isOver, percentage }) => {
    if (isOver) {
      return `
        left: 50%;
        top: calc(50% - 132px);
        transform: translate(-50%, -50%);
      `;
    }
    
    const angle = (percentage / 100) * 360 - 90;
    const radius = 130;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    
    return `
      left: calc(50% + ${x}px);
      top: calc(50% + ${y}px);
      transform: translate(-50%, -50%);
    `;
  }}
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