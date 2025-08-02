import React, { useState, useRef } from 'react';
import { Col, Row } from '@components/common/flex/Flex';
import Header from '@components/common/header/Header';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';

interface CameraScreenProps {
  mode?: 'start' | 'complete';
  taskId?: string;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ 
  mode = 'start', 
  taskId = '1' 
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    console.log('이미지 제출:', capturedImage);
    console.log('모드:', mode);
    console.log('태스크 ID:', taskId);
  };

  return (
    <Container>
      <Header
        isBack={true}
        isRight={false}
        title={mode === 'start' ? '시작 사진' : '완료 사진'}
      />
      <Content>
        {!capturedImage ? (
          <CameraPreview>
            <CameraPlaceholder>
              <CameraIcon>📷</CameraIcon>
              <Txt fontSize="16px" color={colors.textGray}>
                {mode === 'start' ? '시작 사진을 촬영해주세요' : '완료 사진을 촬영해주세요'}
              </Txt>
            </CameraPlaceholder>
          </CameraPreview>
        ) : (
          <CapturedImageContainer>
            <CapturedImage src={capturedImage} alt="captured" />
          </CapturedImageContainer>
        )}

        <ButtonContainer>
          {!capturedImage ? (
            <CaptureButton onClick={handleCapture} disabled={isCapturing}>
              {isCapturing ? '촬영 중...' : '사진 촬영'}
            </CaptureButton>
          ) : (
            <Row gap={15}>
              <RetakeButton onClick={handleRetake}>
                다시 촬영
              </RetakeButton>
              <SubmitButton onClick={handleSubmit}>
                제출하기
              </SubmitButton>
            </Row>
          )}
        </ButtonContainer>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Content>
    </Container>
  );
};

export default CameraScreen;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${colors.white};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  padding: 20px;
`;

const CameraPreview = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const CameraPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const CameraIcon = styled.div`
  font-size: 48px;
`;

const CapturedImageContainer = styled.div`
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const CapturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const CaptureButton = styled.button`
  padding: 15px 30px;
  background-color: ${colors.purple3};
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RetakeButton = styled.button`
  padding: 12px 24px;
  background-color: ${colors.purple1};
  color: ${colors.textBlack};
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background-color: ${colors.purple3};
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`; 