import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon } from '@assets/icons';
import { css } from "@emotion/react";
import { useFindPassword } from '@hooks/api/auth/useFindPassword';
import Txt from '@components/common/Txt';

const FindPasswordContainer = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: ${colors.white};
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  width: 100%;
  height: 61px;
  background: linear-gradient(180deg, #f1e7f9 0%, #f1e7f9 100%);
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
`;

const HeaderTitle = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #1d1d1d;
  margin: 0;
  padding-top: 2px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 60px 30px;
  height: calc(100vh - 61px);
`;

const Title = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 24px;
  color: #1d1d1d;
  margin: 0 0 16px 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #545656;
  margin: 0 0 30px 0;
  text-align: center;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 30px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  background: #f6f6f6;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 0 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  color: #1d1d1d;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #832cc5;
  }

  &::placeholder {
    color: #bababa;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 56px;
  background: #832cc5;
  border: none;
  border-radius: 12px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #6a1fa0;
  }

  &:disabled {
    background: #bababa;
    cursor: not-allowed;
  }
`;

const ErrorText = styled(Txt)`
  color: #bf6a6a;
  font-size: 12px;
  padding-left: 5px;
`;

const FindPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const findPasswordMutation = useFindPassword();
  const [errors, setErrors] = useState('');
  const [sendEmail, setSendEmail] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    
    // Clear errors when user starts typing
    if (errors) {
      setErrors('');
    }
    
    // Clear success message when user starts typing
    if (sendEmail) {
      setSendEmail('');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
        setErrors('이메일을 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
        setErrors('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrors('');

    try {
      const response = await findPasswordMutation.mutateAsync({ email });
      
      if (response.status === 200) {
        navigate('/auth/email-reset-password', { state: { email: email, nickname: response.result.nickname } });
      } else {
        setSendEmail('이메일 발송에 실패했습니다.');
      }
    } catch (error) {
        setSendEmail('이메일 발송에 실패했습니다.\n다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FindPasswordContainer>
      <Header>
        <BackLightIcon
          css={css`
            width: 24px;
            height: 21px;
            cursor: pointer;
            margin-top: 2px;
          `}
          onClick={handleBack}
        />
        <HeaderTitle>비밀번호 찾기</HeaderTitle>
      </Header>

      <Content>
        <Title>비밀번호를 잊으셨나요?</Title>
        <Subtitle>
          가입하신 이메일 주소를 입력하시면<br />
          비밀번호 재설정 링크를 보내드립니다
        </Subtitle>

        <Form onSubmit={handleSubmit}>
            <InputGroup>
                <Input
                    type="text"
                    name="email"
                    placeholder="이메일 주소"
                    value={email}
                    onChange={handleInputChange}
                />
                {errors && <Txt color="#bf6a6a" fontSize="12px">{errors}</Txt>}
             </InputGroup>

            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '10px' }}>
                <SubmitButton type="submit" disabled={isLoading || !email.trim()}>
                    {isLoading ? '발송 중...' : '비밀번호 재설정 이메일 발송'}
                </SubmitButton>
                {sendEmail && (<ErrorText>{sendEmail}</ErrorText>)}
            </div>
        </Form>
      </Content>
    </FindPasswordContainer>
  );
};

export default FindPassword;
