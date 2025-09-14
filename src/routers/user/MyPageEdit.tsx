import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, ImageUploadIcon, ProfileIcon } from '@assets/icons';
import { css } from "@emotion/react";
import { useChangeProfile } from '@hooks/api/user/useChangeProfile';
import { usePresignUpload } from "@hooks/api/auth/useSignup";
import { postUploadToS3 } from '@utils/s3';

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
  margin-left: 16px;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  height: 56px;
  background: #f6f6f6;
  border: none;
  border-radius: 50px;
  padding: 0 16px;
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
  margin-top: 10px;
  margin-left: 16px;
`;

// 이미지 옵션 드롭다운 스타일
const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: #ffffff;
  border: 1px solid #c8b0db;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #1d1d1d;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f6f6f6;
  }
  
  &:first-child {
    border-radius: 12px 12px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 12px 12px;
  }
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
  const location = useLocation();
  const { currentNickname, currentProfileImage } = location.state || { currentNickname: '', currentProfileImage: '' };
  
  const [nickname, setNickname] = useState(currentNickname || '');
  const [isValid, setIsValid] = useState(currentNickname ? true : false);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(currentProfileImage || '');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const changeProfileMutation = useChangeProfile()
  const presignMutation = usePresignUpload();

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
    
    // 닉네임 유효성 검사 (공백 제외)
    if (value.trim().length <= 4 && value.trim().length >= 2 && /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/.test(value.trim())) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleEdit = async () => {
    if (isValid && nickname.trim()) {
      let profileImageKey: string | undefined = undefined;

      if (profileFile) {
        const fileExtension = profileFile.name.split('.').pop()?.toLowerCase() || '.'.concat('jpg');
        const imageType = "PROFILE";
        const contentType = profileFile.type;
        const presignResponse = await presignMutation.mutateAsync({ imageType, fileExtension: `.${fileExtension}`, contentType });

        const { presignedUrl, imageKey } = presignResponse.result;

        await postUploadToS3(presignedUrl, imageKey, profileFile, contentType);

        profileImageKey = imageKey;
      } else if (isDefaultImage) {
        // 기본 이미지로 설정하는 경우 빈 문자열 전송
        profileImageKey = '';
      }

      const result = await changeProfileMutation.mutateAsync({
        nickname: nickname.trim(),
        profileImageKey: profileImageKey || '',
      });
      if (result.status === 200) {
        navigate(-1);
      } 
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);
    setProfileFile(file);
    setIsDefaultImage(false);
  };

  const handleChooseFromGallery = () => {
    galleryInputRef.current?.click();
    setShowDropdown(false);
  };

  const handleSetDefaultImage = () => {
    setProfileImagePreview('');
    setProfileFile(null);
    setIsDefaultImage(true);
    setShowDropdown(false);
  };

  const handleImageClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
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
        <HeaderTitle>프로필 수정</HeaderTitle>
      </Header>

      <Content>
        <ProfileSection>
          <DropdownContainer ref={dropdownRef}>
            <div style={{ position: 'relative' }}>
              {profileImagePreview ? (
                <img 
                  src={profileImagePreview} 
                  alt="Profile Preview" 
                  css={css`
                    width: 102px;
                    height: 102px;
                    border-radius: 50%;
                    border: 2px solid #c8b0db;
                    object-fit: cover;
                    cursor: pointer;
                  `}
                  onClick={handleImageClick}
                />
              ) : (
                <ProfileIcon
                  css={css`
                    width: 102px;
                    height: 102px;
                    border-radius: 50%;
                    border: 2px solid #c8b0db;
                    background: #f6f6f6;
                    cursor: pointer;
                  `}
                  onClick={handleImageClick}
                />
              )}
              <Edit onClick={handleImageClick}>
                <ImageUploadIcon 
                  css={css`
                    width: 14px;
                    height: 14px;
                  `}
                />
              </Edit>
            </div>
            
            <DropdownMenu isOpen={showDropdown}>
              <DropdownItem onClick={handleChooseFromGallery}>
                갤러리에서 선택
              </DropdownItem>
              <DropdownItem onClick={handleSetDefaultImage}>
                기본 이미지로 설정
              </DropdownItem>
            </DropdownMenu>
            
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </DropdownContainer>
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

          <EditButton onClick={handleEdit} disabled={!isValid || !nickname.trim()}>
            수정 완료
          </EditButton>
        </FormSection>
      </Content>
    </EditContainer>
  );
};

export default MyPageEdit; 