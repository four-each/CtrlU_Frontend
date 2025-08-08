import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col } from '@components/common/flex/Flex';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { CTRULogo } from '@assets/icons';

const VerificationContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
  position: relative;
`;

const LogoSection = styled.div`
  margin-top: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const LogoText = styled.h1`
  height: 50px;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 60px;
  color: #000000;
  margin: 0;
  letter-spacing: 0.06px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #1d1d1d;
  margin: 23px 0px 60px 0px;
`;

const ContentSection = styled.div`
  width: 100%;
  max-width: 335px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
`;

const Title = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 22px;
  color: #1d1d1d;
  margin: 0;
  line-height: 26.4px;
`;

const Description = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #545656;
  margin: 0px;
  padding-bottom: 10px;
  line-height: 19.2px;
  white-space: pre-line;
`;

const EmailBox = styled.div`
  width: 100%;
  height: 56px;
  background: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #545656;
  margin-bottom: 20px;
`;

const VerifyButton = styled.button`
  width: 100%;
  height: 56px;
  background: #832cc5;
  border: none;
  border-radius: 50px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #6a1fa0;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const EmailVerification = () => {
  const [email] = useState('abcd12345@naver.com'); // 실제로는 props나 context에서 받아올 예정

  return (
    <VerificationContainer>
      <LogoSection>
        <CTRULogo />
      </LogoSection>

      <Divider />

      <ContentSection>
        <Title>이메일 인증 링크 발송</Title>
        
        <Description>
          {`안녕하세요 000님,\nCtrl U 서비스 이용을 위해\n아래의 이메일 주소로\n인증 링크를 전송하였습니다.\n\n인증 링크를 클릭하여 인증을 완료해주세요.`}
        </Description>

        <EmailBox>
          {email}
        </EmailBox>
      </ContentSection>
    </VerificationContainer>
  );
};

export default EmailVerification; 