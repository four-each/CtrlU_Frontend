import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, ProfileIcon } from '@assets/icons';
import { css } from "@emotion/react";
import { useResetPassword } from '@hooks/api/auth/useResetPassword';

const ResetContainer = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: ${colors.white};
  margin: 0 auto;
  position: relative;
`;

const Header = styled.div`
  width: 100%;
  height: 61px;
  background: linear-gradient(180deg, #f1e7f9 0%, #f1e7f9 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
`;

const HeaderTitle = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 18px;
  height: 22px;
  color: #1d1d1d;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 2px;
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;

const FormSection = styled.div`
  width: 100%;
  max-width: 335px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`;

const InputLabel = styled.label`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #1d1d1d;
  display: block;
  margin-left: 5px;
  margin-bottom: 6px;
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

const ErrorText = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #bf6a6a;
  margin-top: 4px;
  margin-left: 5px;
`;

const ResetButton = styled.button`
  width: 100%;
  max-width: 335px;
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
  margin-top: 20px;
  
  &:hover {
    background: #6a1fa0;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const resetPasswordMutation = useResetPassword();
  const [resetError, setResetError] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const verifyToken = searchParams.get('token') || '';
  
  // 디버깅용 로그
  console.log('Current location:', location);
  console.log('URL search params:', location.search);
  console.log('Token from URL:', verifyToken);

  const handleBack = () => {
    navigate(-1);
  };

  const validatePassword = (password: string) => {
    // 비밀번호 유효성 검사: 8~12자, 영문/숫자 포함
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;
    return passwordRegex.test(password);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    
    if (value.length === 0) {
      setErrors(prev => ({ ...prev, newPassword: '새 비밀번호를 입력해주세요.' }));
    } else if (value.length < 8 || value.length > 12) {
      setErrors(prev => ({ 
        ...prev, 
        newPassword: '비밀번호는 8~12자로 입력해주세요' 
      }));
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(value)) {
      setErrors(prev => ({ 
        ...prev, 
        newPassword: '영문, 숫자를 포함하여 입력해주세요' 
      }));
    } else {
      setErrors(prev => ({ ...prev, newPassword: '' }));
    }
    if (resetError) setResetError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value.length === 0) {
      setErrors(prev => ({ ...prev, confirmPassword: '새 비밀번호 확인을 입력해주세요.' }));
    } else if (value !== newPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
    if (resetError) setResetError('');
  };

  const handleReset = async () => {
    // 모든 필드 검증
    const newErrors = {
      newPassword: newPassword.length === 0 ? '새 비밀번호를 입력해주세요.' : 
                   !validatePassword(newPassword) ? '비밀번호는 8~12자, 영문/숫자를 포함해야 합니다.' : '',
      confirmPassword: confirmPassword.length === 0 ? '새 비밀번호 확인을 입력해주세요.' :
                      confirmPassword !== newPassword ? '비밀번호가 일치하지 않습니다.' : ''
    };

    setErrors(newErrors);

    // 모든 에러가 없으면 재설정 진행
    if (!Object.values(newErrors).some(error => error !== '')) {
      try {
        const result = await resetPasswordMutation.mutateAsync({
          verifyToken,
          newPassword
        });
        if (result.status === 200) {
          navigate(-1);
        } else {
          // 예상치 못한 형태의 응답 대비
          setResetError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        // http 유틸이 !ok에서 throw 하므로 여기서 401 처리
        setResetError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const isFormValid = () => {
    return newPassword.length > 0 && 
           confirmPassword.length > 0 &&
           validatePassword(newPassword) &&
           newPassword === confirmPassword;
  };

  return (
    <ResetContainer>
      <Header>
        <BackLightIcon 
          css={css`
            width: 24px;
            height: 21px;
            cursor: pointer;
            margin-top: 2px;
          `}
          onClick={handleBack} />
        <HeaderTitle>비밀번호 재설정</HeaderTitle>
      </Header>

      <Content>
        <ProfileSection>
          <ProfileIcon 
            css={css`
              width: 102px;
              height: 102px;
              border-radius: 50%;
              border: 2px solid #c8b0db;
              object-fit: cover;
            `} />
        </ProfileSection>

        <FormSection>
          <InputGroup>
            <InputLabel>새 비밀번호</InputLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="새 비밀번호를 입력하세요"
            />
            {errors.newPassword && (
              <ErrorText>{errors.newPassword}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <InputLabel>새 비밀번호 확인</InputLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="새 비밀번호를 다시 입력하세요"
            />
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword}</ErrorText>
            )}
          </InputGroup>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
            <ResetButton onClick={handleReset} disabled={!isFormValid()}>
              재설정 완료
            </ResetButton>
            {resetError && <ErrorText>{resetError}</ErrorText>}
          </div>
        </FormSection>
      </Content>
    </ResetContainer>
  );
};

export default ResetPassword; 