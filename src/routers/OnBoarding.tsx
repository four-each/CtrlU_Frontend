import { ClockIcon, CTRULogo, Owl } from "@assets/icons";
import Button from "@components/common/button/Button";
import { Col, Row } from "@components/common/flex/Flex";
import Txt from "@components/common/Txt";
import { css } from "@emotion/react";
import { colors } from "@styles/theme";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

export default function OnBoarding() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth/login');
  };

  const handleSignupClick = () => {
    navigate('/auth/signup');
  };

  return (
    <Container>
      <Col>
      <div
        css={css`
          width: 100%;
          height: 55px;
          background-color: ${colors.purple1};
        `}
      />
      <div
        css={css`
          width: 100%;
          height: 167px;
          position: absolute;
          top: 55px;
          background: linear-gradient(0deg, #fff -10.96%, #f1e7f9 100%);
        `}
      />
      <ClockIcon
        css={css`
          position: absolute;
          top: 80px;
          right: 48px;
          width: 137px;
          height: 137px;
        `}
      />

      <Col
        gap={22}
        justify="flex-start"
        align="flex-start"
        padding="74px 30px 0"
      >
        <Col justify="flex-start" align="flex-start" gap={33}>
          <Txt fontSize="2rem" color={colors.purple3}>
            계획은 많았는데, <br />
            시작은 하나도 못했다면?
          </Txt>
          <Txt fontSize="2rem" color={colors.purple3}>
            컨트롤이 필요한 우리, <br />
            너를 컨트롤할 시간.
          </Txt>
        </Col>
        <CTRULogo />
      </Col>
      <Col gap={22} justify="flex-start" align="center">
        <Row justify="flex-end" align="center" padding={"0 30px"}>
          <Owl />
        </Row>
        <Col padding={"0 20px"} gap={12} align="center">
          <Button
            title="로그인"
            textColor={colors.white}
            bgColor={colors.purple3}
            onClick={handleLoginClick}
          />
          <Button
            title="회원가입"
            textColor={colors.textBlack}
            bgColor={colors.white}
            shadow={true}
            onClick={handleSignupClick}
          />
        </Col>
      </Col>
      </Col>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: ${colors.white};
  margin: 0 auto;
`;
