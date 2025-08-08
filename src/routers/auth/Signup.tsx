import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col } from '@components/common/flex/Flex';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';

const SignupContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
  position: relative;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  margin-top: 60px;
`;

const ProfileImage = styled.img`
  width: 102px;
  height: 102px;
  border-radius: 50%;
  border: 2px solid #c8b0db;
  background: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

const Upload = styled.div`
  position: absolute;
  bottom: 4px;
  right: 0;
  width: 26px;
  height: 26px;
  background: #ad8aca;
  border: 2px solid #ffffff;
  border-radius: 50%;
  cursor: pointer;
  padding: 4px;
`;

const UploadIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 335px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding-bottom: 20px;
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
  margin-bottom: 6px;
  margin-left: 5px;
  display: block;
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

const ErrorMessage = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #bf6a6a;
  margin-top: 4px;
  margin-left: 5px;
  text-align: left;
`;

const HelperText = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #bababa;
  margin-top: 4px;
`;

const SignupButton = styled.button`
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

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });

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
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
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
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$/.test(formData.password)) {
      newErrors.password = '영문, 숫자, 특수문자를 포함하여 입력해주세요';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요';
    } else if (!/^[가-힣a-zA-Z0-9]+$/.test(formData.nickname)) {
      newErrors.nickname = '한글, 영어, 숫자만 가능합니다';
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상 입력해주세요';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSignup = () => {
    if (validateForm()) {
      // TODO: 실제 회원가입 로직 구현
      console.log('회원가입 시도:', formData);
      navigate('/auth/email-verification');
    }
  };

  const handleCameraClick = () => {
    // TODO: 카메라 기능 구현
    console.log('프로필 사진 촬영');
  };

  return (
    <SignupContainer>
      <ProfileSection>
        <div style={{ position: 'relative' }}>
          <ProfileImage src='/assets/default-profile.jpg' alt="프로필 이미지" onClick={handleCameraClick} />
          <Upload onClick={handleCameraClick}>
            <UploadIcon src='/assets/image-upload.png' alt="프로필 이미지" />
          </Upload>
        </div>
      </ProfileSection>

      <FormContainer>
        <InputGroup>
          <InputLabel>이메일</InputLabel>
          <Input
            type="email"
            name="email"
            placeholder="이메일 주소"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <InputLabel>비밀번호</InputLabel>
          <Input
            type="password"
            name="password"
            placeholder="비밀번호(영문+숫자 8~12자)"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <InputLabel>비밀번호 확인</InputLabel>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호(영문+숫자 8~12자)"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <InputLabel>닉네임</InputLabel>
          <Input
            type="text"
            name="nickname"
            placeholder="한글, 영어, 숫자만 가능"
            value={formData.nickname}
            onChange={handleInputChange}
          />
          {errors.nickname && <ErrorMessage>{errors.nickname}</ErrorMessage>}
          {!errors.nickname && formData.nickname && (
            <HelperText>한글, 영어, 숫자만 가능</HelperText>
          )}
        </InputGroup>
        <SignupButton onClick={handleSignup}>
          완료
        </SignupButton>
      </FormContainer>
    </SignupContainer>
  );
};

export default Signup; 