import React, { useState, useRef, useEffect } from 'react';
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
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 컴포넌트 언마운트 시 카메라 정리
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      console.log('카메라 시작 시도...');
      
      // 카메라 지원 여부 확인
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('이 브라우저는 카메라를 지원하지 않습니다.');
      }
      
      // 더 간단한 카메라 설정으로 시도
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true // 기본 설정으로 시도
      });
      
      console.log('카메라 스트림 획득 성공:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // 즉시 활성화 시도
        setIsCameraActive(true);
        
        // 비디오 로드 완료 이벤트 추가
        videoRef.current.onloadedmetadata = () => {
          console.log('비디오 메타데이터 로드 완료');
          setIsCameraActive(true);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('비디오 재생 가능');
          setIsCameraActive(true);
        };
        
        videoRef.current.onerror = (e) => {
          console.error('비디오 로드 오류:', e);
          setCameraError('비디오 스트림을 로드할 수 없습니다.');
          setIsCameraActive(false);
        };
        
        console.log('비디오 요소에 스트림 설정 완료');
      }
    } catch (error) {
      console.error('카메라 접근 오류:', error);
      
      let errorMessage = '카메라에 접근할 수 없습니다.';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = '카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = '카메라를 찾을 수 없습니다.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = '이 브라우저는 카메라를 지원하지 않습니다.';
        } else {
          errorMessage = `카메라 오류: ${error.message}`;
        }
      }
      
      setCameraError(errorMessage);
      setIsCameraActive(false);
      console.log('파일 선택으로 폴백');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleCapture = () => {
    if (isCameraActive && videoRef.current && canvasRef.current) {
      setIsCapturing(true);
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
      
      setIsCapturing(false);
    } else {
      // 카메라가 활성화되지 않은 경우 파일 선택
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
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
    setCameraError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // 카메라 다시 시작
    startCamera();
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
            {isCameraActive ? (
              <VideoContainer>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '12px',
                    backgroundColor: '#000'
                  }}
                />
                <CameraOverlay>
                  <Txt fontSize="16px" color="white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                    카메라 준비 완료
                  </Txt>
                </CameraOverlay>
              </VideoContainer>
            ) : cameraError ? (
              <CameraPlaceholder>
                <CameraIcon>⚠️</CameraIcon>
                <Txt fontSize="14px" color={colors.red}>
                  {cameraError}
                </Txt>
                <Txt fontSize="16px" color={colors.textGray}>
                  {mode === 'start' ? '시작 사진을 촬영해주세요' : '완료 사진을 촬영해주세요'}
                </Txt>
              </CameraPlaceholder>
            ) : (
              <CameraPlaceholder>
                <CameraIcon>📷</CameraIcon>
                <Txt fontSize="16px" color={colors.textGray}>
                  {mode === 'start' ? '시작 사진을 촬영해주세요' : '완료 사진을 촬영해주세요'}
                </Txt>
              </CameraPlaceholder>
            )}
          </CameraPreview>
        ) : (
          <CapturedImageContainer>
            <CapturedImage src={capturedImage} alt="captured" />
          </CapturedImageContainer>
        )}

        <ButtonContainer>
          {!capturedImage ? (
            <>
              {!isCameraActive && !cameraError && (
                <CaptureButton onClick={() => {
                  console.log('카메라 시작 버튼 클릭됨');
                  startCamera();
                }}>
                  카메라 시작
                </CaptureButton>
              )}
              {isCameraActive && (
                <CaptureButton onClick={handleCapture} disabled={isCapturing}>
                  {isCapturing ? '촬영 중...' : '사진 촬영'}
                </CaptureButton>
              )}
              {cameraError && (
                <Row gap={15}>
                  <CaptureButton onClick={startCamera}>
                    카메라 재시도
                  </CaptureButton>
                  <CaptureButton onClick={() => fileInputRef.current?.click()}>
                    파일 선택
                  </CaptureButton>
                </Row>
              )}
              {/* 디버깅 정보 */}
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                카메라 상태: {isCameraActive ? '활성' : '비활성'} | 
                에러: {cameraError ? '있음' : '없음'}
              </div>
            </>
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
        
        <canvas
          ref={canvasRef}
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

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const CameraOverlay = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
  z-index: 10;
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