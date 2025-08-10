import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, ImageUploadIcon } from '@assets/icons';
import profileIcon from '../../assets/icons/home/profile.svg';
import { css } from "@emotion/react";

const EditContainer = styled.div`
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

const ProfileImage = styled.img`
  width: 102px;
  height: 102px;
  border-radius: 50%;
  border: 2px solid #c8b0db;
  object-fit: cover;
  position: relative;
`;

const Edit = styled.div`
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

const FormSection = styled.div`
  width: 100%;
  max-width: 335px;
  display: flex;
  flex-direction: column;
  gap: 60px;
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

const HelperText = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #832cc5;
  margin-top: 4px;
  margin-left: 5px;
`;

const EditButton = styled.button`
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

const MyPageEdit = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('ㅇㅇㅇ');
  const [isValid, setIsValid] = useState(true);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCameraClick = () => {
    // TODO: 카메라 기능 구현
    console.log('프로필 사진 촬영');
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    
    // 닉네임 유효성 검사
    if (value.length >= 2 && /^[가-힣a-zA-Z0-9]+$/.test(value)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleEdit = () => {
    if (isValid) {
      // TODO: 실제 수정 로직 구현
      console.log('수정 완료:', nickname);
      navigate(-1);
    }
  };

  return (
    <EditContainer>
      <Header>
        <BackLightIcon 
          css={css`
            width: 24px;
            height: 21px;
            cursor: pointer;
            margin-top: 2px;
          `}
          onClick={handleBack} />
        <HeaderTitle>마이페이지 수정</HeaderTitle>
      </Header>

      <Content>
        <ProfileSection>
          <div style={{ position: 'relative' }}>
            <ProfileImage src={profileIcon} alt="프로필 이미지" onClick={handleCameraClick} />
            <Edit onClick={handleCameraClick}>
              <ImageUploadIcon 
                css={css`
                  width: 14px;
                  height: 14px;
                `}
              />
            </Edit>
          </div>
        </ProfileSection>

        <FormSection>
          <InputGroup>
            <InputLabel>닉네임</InputLabel>
            <Input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              placeholder="닉네임을 입력하세요"
            />
            {isValid && nickname.length > 0 && (
              <HelperText>사용 가능한 닉네임입니다.</HelperText>
            )}
          </InputGroup>

          <EditButton onClick={handleEdit} disabled={!isValid}>
            수정 완료
          </EditButton>
        </FormSection>
      </Content>
    </EditContainer>
  );
};

export default MyPageEdit; 