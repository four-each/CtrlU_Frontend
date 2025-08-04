import React, { useState, useRef, useEffect } from 'react';
import { Col, Row } from '@components/common/flex/Flex';
import Header from '@components/common/header/Header';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { useNavigate, useParams } from 'react-router-dom';

interface CameraScreenProps {
  mode?: 'start' | 'complete';
  taskId?: string;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ 
  mode: propMode, 
  taskId = '1' 
}) => {
  const navigate = useNavigate();
  const params = useParams();
  
  // URL 파라미터에서 mode를 가져오고, 없으면 prop을 사용하고, 그것도 없으면 'start'를 기본값으로 사용
  const mode = params.mode as 'start' | 'complete' || propMode || 'start';
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 컴포넌트 마운트 시 카메라 자동 시작
  useEffect(() => {
    startCamera();
    
    // 컴포넌트 언마운트 시 카메라 정리
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
      console.log('videoRef.current:', videoRef.current);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // 즉시 활성화 시도
        setIsCameraActive(true);
        
        // 비디오 로드 완료 이벤트 추가
        videoRef.current.onloadedmetadata = () => {
          console.log('비디오 메타데이터 로드 완료');
          console.log('비디오 크기:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          setIsCameraActive(true);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('비디오 재생 가능');
          setIsCameraActive(true);
        };
        
        videoRef.current.onplay = () => {
          console.log('비디오 재생 시작');
        };
        
        videoRef.current.onerror = (e) => {
          console.error('비디오 로드 오류:', e);
          setCameraError('비디오 스트림을 로드할 수 없습니다.');
          setIsCameraActive(false);
        };
        
        console.log('비디오 요소에 스트림 설정 완료');
        console.log('비디오 요소:', videoRef.current);
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
    
    if (mode === 'start') {
      // 시작 모드일 때는 CreateTask.tsx로 이동
      navigate('/create-task', { 
        state: { 
          startImage: capturedImage 
        } 
      });
    } else {
      // 완료 모드일 때는 Success.tsx로 이동
      navigate('/success');
    }
  };

  return (
    <Container>
      {/* 상단 헤더 */}
      <HeaderSection>
        <HeaderContent>
          <BackButton onClick={() => window.history.back()}>
            <BackIcon src="/assets/back.png" alt="뒤로가기" />
          </BackButton>
          <Title>{mode === 'start' ? '시작' : '완료'}</Title>
        </HeaderContent>
      </HeaderSection>

      {/* 카메라 영역 */}
      <CameraSection>
        {!capturedImage ? (
          <CameraPreview>
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
                backgroundColor: '#000',
                display: isCameraActive ? 'block' : 'none'
              }}
            />
              {!isCameraActive && cameraError && (
                <CameraPlaceholder>
                  <CameraIcon>⚠️</CameraIcon>
                  <Txt fontSize="14px" color={colors.red}>
                    {cameraError}
                  </Txt>
                  <Txt fontSize="16px" color={colors.textGray}>
                    {mode === 'start' ? '시작 사진을 촬영해주세요' : '완료 사진을 촬영해주세요'}
                  </Txt>
                </CameraPlaceholder>
              )}
              {!isCameraActive && !cameraError && (
                <CameraPlaceholder>
                  <CameraIcon>📷</CameraIcon>
                  <Txt fontSize="16px" color={colors.textGray}>
                    {mode === 'start' ? '시작 사진을 촬영해주세요' : '완료 사진을 촬영해주세요'}
                  </Txt>
                </CameraPlaceholder>
              )}
            </VideoContainer>
          </CameraPreview>
        ) : (
          <CapturedImageContainer>
            <CapturedImage src={capturedImage} alt="captured" />
          </CapturedImageContainer>
        )}
      </CameraSection>

      {/* 하단 버튼 영역 */}
      <BottomSection>
        {!capturedImage ? (
          <CaptureButtonContainer>
            <CaptureButton onClick={handleCapture} disabled={isCapturing || !isCameraActive}>
              <ShootIcon src="/assets/shoot.png" alt="촬영" />
            </CaptureButton>
            {cameraError && (
              <ErrorButtons>
                <RetakeButton onClick={startCamera}>
                  카메라 재시도
                </RetakeButton>
                <RetakeButton onClick={() => fileInputRef.current?.click()}>
                  파일 선택
                </RetakeButton>
              </ErrorButtons>
            )}
          </CaptureButtonContainer>
        ) : (
          <ActionButtons>
            <RetakeButton onClick={handleRetake}>
              다시 촬영
            </RetakeButton>
            <SubmitButton onClick={handleSubmit}>
              제출하기
            </SubmitButton>
          </ActionButtons>
        )}
      </BottomSection>

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
      </Container>
  );
};

export default CameraScreen;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: ${colors.white};
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

// 상단 헤더 스타일
const HeaderSection = styled.div`
  background-color: #ad8aca;
  height: 60px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  margin-top: 0;
  position: relative;
`;

const Title = styled.h1`
  color: white;
  font-size: 18px;
  font-weight: 500;
  font-family: 'Noto Sans KR', sans-serif;
  margin: 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
`;

const BackIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;



// 카메라 영역 스타일
const CameraSection = styled.div`
  flex: 1;
  background-color: black;
  display: flex;
  flex-direction: column;
`;

const CameraPreview = styled.div`
  flex: 1;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
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
  overflow: hidden;
  position: relative;
`;

const CameraIcon = styled.div`
  font-size: 48px;
`;

const CapturedImageContainer = styled.div`
  flex: 1;
  overflow: hidden;
  background-color: white;
`;

const CapturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 하단 버튼 영역 스타일
const BottomSection = styled.div`
  background-color: #ad8aca;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const CaptureButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const CaptureButton = styled.button`
  width: 80px;
  height: 80px;
`;

const ShootIcon = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const ErrorButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const RetakeButton = styled.button`
  padding: 12px 24px;
  background-color: white;
  color: #ad8aca;
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
  background-color: white;
  color: #ad8aca;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`; 