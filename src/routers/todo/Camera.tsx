import React, { useState, useRef, useEffect } from 'react';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { useNavigate, useParams } from 'react-router-dom';
import backArrowWhiteIcon from '../../assets/icons/detail/backArrow_white.svg';
import shootIcon from '../../assets/icons/detail/shoot.svg';

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
  const [showModal, setShowModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [description, setDescription] = useState('');
  const [selectedHours, setSelectedHours] = useState(2);
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const [currentCamera, setCurrentCamera] = useState<'front' | 'back'>('back');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hoursScrollRef = useRef<HTMLDivElement>(null);
  const minutesScrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 사용 가능한 카메라 목록 가져오기
  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      console.log('사용 가능한 카메라:', videoDevices);
    } catch (error) {
      console.error('카메라 목록 가져오기 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 카메라 자동 시작
  useEffect(() => {
    getAvailableCameras();
    startCamera();
    
    // 컴포넌트 언마운트 시 카메라 정리
    return () => {
      stopCamera();
    };
  }, [currentCamera]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      console.log('카메라 시작 시도...');
      
      // 카메라 지원 여부 확인
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('이 브라우저는 카메라를 지원하지 않습니다.');
      }
      
      // 후면 카메라 우선 시도
      const constraints = {
        video: {
          facingMode: currentCamera === 'back' ? 'environment' : 'user'
        }
      };
      
      console.log('카메라 제약 조건:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
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

  const handleCameraSwitch = () => {
    setCurrentCamera(currentCamera === 'back' ? 'front' : 'back');
  };

  const handleSubmit = () => {
    console.log('이미지 제출:', capturedImage);
    console.log('모드:', mode);
    console.log('태스크 ID:', taskId);
    
    if (mode === 'start') {
      // 시작 모드일 때는 모달을 띄움
      setShowModal(true);
    } else {
      // 완료 모드일 때는 Success.tsx로 이동하면서 사진 데이터 전달
      navigate('/success', { 
        state: { 
          capturedImage: capturedImage 
        } 
      });
    }
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    setSelectedHours(hours);
    setSelectedMinutes(minutes);
  };

  // 스크롤 위치를 선택된 값으로 초기화
  useEffect(() => {
    if (showModal && hoursScrollRef.current && minutesScrollRef.current) {
      const itemHeight = 36; // 각 아이템의 높이

      // 시간 스크롤 위치 계산
      const hoursScrollTop = selectedHours * itemHeight;
      hoursScrollRef.current.scrollTop = hoursScrollTop;

      // 분 스크롤 위치 계산
      const minutesScrollTop = selectedMinutes * itemHeight;
      minutesScrollRef.current.scrollTop = minutesScrollTop;
    }
  }, [showModal]);

  // 스크롤 이벤트 핸들러 추가
  useEffect(() => {
    if (!showModal) return;

    const handleHoursScroll = () => {
      if (hoursScrollRef.current) {
        const scrollTop = hoursScrollRef.current.scrollTop;
        const itemHeight = 36;
        const selectedIndex = Math.round(scrollTop / itemHeight);
        const clampedIndex = Math.max(0, Math.min(9, selectedIndex));
        setSelectedHours(clampedIndex);
      }
    };

    const handleMinutesScroll = () => {
      if (minutesScrollRef.current) {
        const scrollTop = minutesScrollRef.current.scrollTop;
        const itemHeight = 36;
        const selectedIndex = Math.round(scrollTop / itemHeight);
        const clampedIndex = Math.max(0, Math.min(59, selectedIndex));
        setSelectedMinutes(clampedIndex);
      }
    };

    // 모달이 열린 후 약간의 지연을 두고 이벤트 리스너 추가
    const timer = setTimeout(() => {
      const hoursElement = hoursScrollRef.current;
      const minutesElement = minutesScrollRef.current;

      if (hoursElement) {
        hoursElement.addEventListener('scroll', handleHoursScroll);
      }
      if (minutesElement) {
        minutesElement.addEventListener('scroll', handleMinutesScroll);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const hoursElement = hoursScrollRef.current;
      const minutesElement = minutesScrollRef.current;

      if (hoursElement) {
        hoursElement.removeEventListener('scroll', handleHoursScroll);
      }
      if (minutesElement) {
        minutesElement.removeEventListener('scroll', handleMinutesScroll);
      }
    };
  }, [showModal]);

  const handleModalComplete = () => {
    if (!description.trim()) {
      setWarningMessage('목표를 입력해주세요.');
      setShowWarningModal(true);
      return;
    }

    // 활동명 10자 제한 확인
    if (description.trim().length > 10) {
      setWarningMessage('목표는 10자 이내로 작성해주세요.');
      setShowWarningModal(true);
      return;
    }

    const targetTime = selectedHours * 60 + selectedMinutes;
    if (targetTime === 0) {
      setWarningMessage('목표 시간을 설정해주세요.');
      setShowWarningModal(true);
      return;
    }

    // CreateTask.tsx로 이동하면서 입력받은 데이터 전달
    navigate('/create-task', { 
      state: { 
        startImage: capturedImage,
        description: description.trim(),
        selectedHours,
        selectedMinutes
      } 
    });
  };

  return (
    <Container>
      {/* 상단 헤더 */}
      <HeaderSection>
        <HeaderContent>
          <BackButton onClick={() => window.history.back()}>
            <BackIcon src={backArrowWhiteIcon} alt="뒤로가기" />
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
              {isCameraActive && (
                <CameraSwitchButton onClick={handleCameraSwitch}>
                  <CameraSwitchIcon>🔄</CameraSwitchIcon>
                </CameraSwitchButton>
              )}
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
              <ShootIcon src={shootIcon} alt="촬영" />
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

        {/* Mission Setting Modal */}
        {showModal && (
          <ModalOverlay>
            <ModalContainer>
              <ModalHeader>
                <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <ModalContent>
                <ModalSection>
                  <ModalSectionTitle>목표 설정</ModalSectionTitle>
                  <ModalInput
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="목표를 입력하세요"
                    maxLength={10}
                  />
                </ModalSection>

                <ModalSection>
                  <ModalSectionTitle>시간 설정</ModalSectionTitle>
                  <TimePickerContainer>
                    <CustomTimePickerContainer>
                      <TimePickerColumn>
                        <TimePickerScroll ref={hoursScrollRef}>
                          <div style={{ height: '18px', flexShrink: 0 }} />
                          {Array.from({ length: 10 }, (_, i) => (
                            <TimePickerOption
                              key={i}
                              isSelected={selectedHours === i}
                            >
                              {i.toString().padStart(2, '0')}
                            </TimePickerOption>
                          ))}
                          <div style={{ height: '18px', flexShrink: 0 }} />
                        </TimePickerScroll>
                        <TimePickerLabel>시간</TimePickerLabel>
                      </TimePickerColumn>
                      <TimePickerColumn>
                        <TimePickerScroll ref={minutesScrollRef}>
                          <div style={{ height: '18px', flexShrink: 0 }} />
                          {Array.from({ length: 60 }, (_, i) => (
                            <TimePickerOption
                              key={i}
                              isSelected={selectedMinutes === i}
                            >
                              {i.toString().padStart(2, '0')}
                            </TimePickerOption>
                          ))}
                          <div style={{ height: '18px', flexShrink: 0 }} />
                        </TimePickerScroll>
                        <TimePickerLabel>분</TimePickerLabel>
                      </TimePickerColumn>
                    </CustomTimePickerContainer>
                    <SelectedTimeHighlight />
                  </TimePickerContainer>
                </ModalSection>
              </ModalContent>

              <ModalFooter>
                <ModalCompleteButton onClick={handleModalComplete}>
                  완료
                </ModalCompleteButton>
              </ModalFooter>
            </ModalContainer>
          </ModalOverlay>
        )}

        {/* Warning Modal */}
        {showWarningModal && (
          <ModalOverlay>
            <ModalContainer>
              <ModalContent>
                <ModalSection>
                  <WarningMessage>
                    {warningMessage}
                  </WarningMessage>
                </ModalSection>
              </ModalContent>

              <ModalFooter>
                <ModalCompleteButton onClick={() => setShowWarningModal(false)}>
                  확인
                </ModalCompleteButton>
              </ModalFooter>
            </ModalContainer>
          </ModalOverlay>
        )}
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

const CameraSwitchButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const CameraSwitchIcon = styled.div`
  font-size: 20px;
  color: white;
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

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 320px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 24px;
  padding-top: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

const ModalContent = styled.div`
  padding: 24px;
  padding-top: 10px;
  padding-bottom: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalSection = styled.div`
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ModalSectionTitle = styled.h3`
  margin: 0 0 24px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  text-align: left;
  width: 100%;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px 40px;
  max-width: 233px;
  background-color: #f5f5f5;
  border-radius: 50px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  color: #57534e;
  font-size: 16px;
  text-align: center;
  border: none;
  outline: none;
  align-self: center;
  
  &::placeholder {
    color: #a8a29e;
  }
  
  &:focus {
    box-shadow: 0px 0px 4px rgba(124, 58, 237, 0.3);
  }
`;

// Custom Time Picker Styles (Image-like design)
const TimePickerContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CustomTimePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  background-color: transparent;
  padding: 20px;
  align-self: center;
  position: relative;
  width: 200px;
  height: 100px;
  z-index: 1;
`;

const SelectedTimeHighlight = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(233 / 375 * 100vw);
  max-width: 233px;
  height: 35px;
  background-color: #f5f5f5;
  border-radius: 50px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  z-index: 0;
  pointer-events: none;
`;

const TimePickerColumn = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
  justify-content: center;
`;

const TimePickerScroll = styled.div`
  display: flex;
  flex-direction: column;
  height: 72px;
  overflow-y: auto;
  position: relative;
  align-items: center;
  
  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
`;

const TimePickerOption = styled.div<{ isSelected: boolean }>`
  padding: 8px 10px;
  font-size: 18px;
  font-weight: ${props => props.isSelected ? '400' : '200'};
  color: ${props => props.isSelected ? '#000' : '#999'};
  text-align: center;
  transition: all 0.2s ease;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  z-index: 10;
  background-color: transparent;
  border-radius: 8px;
  margin: 8px 0;
`;

const TimePickerLabel = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #333;
  margin-left: 4px;
  position: absolute;
  right: -20px;
  z-index: 10;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 24px;
  padding-bottom: 10px;
`;

const ModalCompleteButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;
  padding: 0px 16px;
  border-radius: 6px;
  margin-bottom: 15px;
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

const WarningMessage = styled.div`
  text-align: center;
  font-size: 16px;
  color: #832CC5;
  font-weight: 500;
  padding-top: 24px;
`; 