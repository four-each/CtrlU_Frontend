import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
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

const EmailResetPassword = () => {
  const { email, nickname } = useLocation().state as { email: string, nickname: string };

  return (
    <VerificationContainer>
      <LogoSection>
        <CTRULogo />
      </LogoSection>

      <Divider />

      <ContentSection>
        <Title>비밀번호 재설정 링크 발송</Title>
        
        <Description>
          {`안녕하세요 ${nickname}님,\nCtrl U 서비스 이용을 위해\n아래의 이메일 주소로\n비밀번호 재설정 링크를 전송하였습니다.\n\n링크를 클릭하여 비밀번호 설정을 완료해주세요.`}
        </Description>

        <EmailBox>
          {email}
        </EmailBox>
      </ContentSection>
    </VerificationContainer>
  );
};

export default EmailResetPassword; 