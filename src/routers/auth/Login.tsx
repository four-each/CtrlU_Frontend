import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { CTRULogo, Owl } from '@assets/icons';
import { css } from "@emotion/react";
import { useLogin } from '@hooks/api/auth/useLogin';

const LoginContainer = styled.div`
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
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 335px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  bottom: 175px;
  margin-top: 30px;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  background: #f6f6f6;
  border: none;
  border-radius: 50px;
  padding: 0 26px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  outline: none;
  
  &::placeholder {
    color: #bababa;
  }
  
  &:focus {
    background: #ffffff;
    border: 1px solid #832cc5;
  }
`;

const ErrorText = styled(Txt)`
  color: #bf6a6a;
  font-size: 12px;
  padding-left: 5px;
`;

const LoginButton = styled.button`
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

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
`;

const Link = styled.button`
  background: none;
  border: none;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #545656;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: 0.014px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  color: #545656;
  font-size: 13px;
  margin-bottom: 5px;    
`;

const Login = () => {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = '이메일 주소를 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 주소를 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8 || formData.password.length > 12) {
      newErrors.password = '비밀번호는 8~12자로 입력해주세요';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(formData.password)) {
      newErrors.password = '영문과 숫자를 포함하여 입력해주세요';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        const result = await loginMutation.mutateAsync(formData);
        if (result.status === 200) {
          navigate('/');
        } else {
          setLoginError('이메일 또는 비밀번호가 일치하지 않습니다.');
        }
      } catch (error) {
        setLoginError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleSignupClick = () => {
    navigate('/auth/signup');
  };

  const handleForgotPassword = () => {
    navigate('/auth/find-password');
  };

  return (
    <LoginContainer>
      <LogoSection>
        <Owl 
          css={css`
            width: 100px;
            height: 108px;
          `} />
        <CTRULogo />
      </LogoSection>
      
      <FormContainer>
        <InputGroup>
          <Input
            type="email"
            name="email"
            placeholder="이메일 주소"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <Txt color="#bf6a6a" fontSize="12px">{errors.email}</Txt>}
        </InputGroup>

        <InputGroup>
          <Input
            type="password"
            name="password"
            placeholder="비밀번호(영문+숫자 8~12자)"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <Txt color="#bf6a6a" fontSize="12px">{errors.password}</Txt>}
        </InputGroup>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: '10px' }}>
          <LoginButton onClick={handleLogin} disabled={loginMutation.isPending}>
            로그인
          </LoginButton>
          {loginError && <ErrorText>{loginError}</ErrorText>}
        </div>

        <LinksContainer>
          <Link onClick={handleForgotPassword}>
            비밀번호 찾기
          </Link>
          <Divider>|</Divider>
          <Link onClick={handleSignupClick}>
            회원가입
          </Link>
        </LinksContainer>
      </FormContainer>
    </LoginContainer>
  );
};

export default Login; 