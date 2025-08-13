import React, { useState, useRef, useEffect } from 'react';
import { Col, Row } from '@components/common/flex/Flex';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { useNavigate, useLocation } from 'react-router-dom';
import backArrow from '../../assets/icons/detail/backArrow.svg';
import profileIcon from '../../assets/icons/home/profile.svg';
import ganadiIcon from '../../assets/icons/detail/ganadi.svg';
import ringIcon from '../../assets/icons/detail/ring.svg';
import whiteCircleIcon from '../../assets/icons/detail/whiteCircle.svg';
import arrowIcon from '../../assets/icons/detail/arrow.svg';

interface SuccessProps {
  taskName?: string;
  targetTime?: string;
  actualTime?: string;
  onClose?: () => void;
}

const Success: React.FC<SuccessProps> = ({ 
  taskName = "미션", 
  targetTime = "02:30:00",
  actualTime = "02:10:10",
  onClose 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCapturedImage, setShowCapturedImage] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showPurpleOverlay, setShowPurpleOverlay] = useState(false);
  const overlayTimerRef = useRef<number | null>(null);
  
  // location.state에서 사진 데이터 가져오기
  const capturedImage = location.state?.capturedImage || null;
  const startImage = location.state?.startImage || null;

  // 컴포넌트 마운트 시 ganadi 아이콘에 보라색 오버레이 적용
  useEffect(() => {
    overlayTimerRef.current = setTimeout(() => {
      setShowPurpleOverlay(true);
    }, 1000);
  }, []);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  const handleImageClick = () => {
    // 기존 타이머가 있으면 클리어
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
    }
    
    // 오버레이 숨기기
    setShowPurpleOverlay(false);
    
    setIsRotating(true);
    setTimeout(() => {
      setShowCapturedImage(!showCapturedImage);
      setIsRotating(false);
      
      // 1초 후에 보라색 오버레이 표시 (사진이든 아이콘이든)
      overlayTimerRef.current = setTimeout(() => {
        setShowPurpleOverlay(true);
      }, 1000);
    }, 300); // 애니메이션 중간에 이미지 변경
  };

  return (
    <SuccessContainer>
      {/* 헤더 */}
      <Header>
            <BackButton onClick={handleBack}>
            <img src={backArrow} alt="뒤로가기" />
          </BackButton>
      </Header>

      {/* 메인 콘텐츠 */}
      <MainContent>
        {/* 프로필 섹션 */}
        <ProfileSection>
          <ProfileImage>
            <img src={profileIcon} alt="프로필" />
          </ProfileImage>
          <Txt fontSize="22px" fontWeight={500} color="#1d1d1d">
            졸업하기
          </Txt>
        </ProfileSection>

        {/* 원형 프로그레스 바 */}
        <ProgressSection>
          <ProgressCircle>
            <RingImage src={ringIcon} alt="프로그레스 링" />
            <WhiteCircleImage src={whiteCircleIcon} alt="흰색 원 배경" />
            <ProgressImage 
              onClick={handleImageClick}
              style={{ cursor: 'pointer' }}
              isRotating={isRotating}
            >
              <img 
                src={showCapturedImage && (capturedImage || startImage) ? (capturedImage || startImage) : ganadiIcon} 
                alt={showCapturedImage && (capturedImage || startImage) ? "사진" : "완료 이미지"} 
              />
              {showPurpleOverlay && (
                <PurpleOverlay />
              )}
            </ProgressImage>
            {showPurpleOverlay && (
              <ArrowIcon src={arrowIcon} alt="화살표" />
            )}
          </ProgressCircle>
        </ProgressSection>

        {/* 목표 시간 */}
        <TargetTimeSection>
          <TargetTimeBox>
            <Txt fontSize="14px" fontWeight={400} color="#1d1d1d">
              목표 시간: {targetTime}
            </Txt>
          </TargetTimeBox>
        </TargetTimeSection>

        {/* 실제 완료 시간 */}
        <ActualTimeSection>
          <Txt fontSize="60px" fontWeight={500} color="#832cc5">
            {actualTime}
          </Txt>
        </ActualTimeSection>

        {/* 축하 메시지 */}
        <CelebrationSection>
          <CelebrationText>
            우와, 목표를 이루셨군요{'\n'}
            정말 대단해요!☺️
          </CelebrationText>
        </CelebrationSection>
      </MainContent>
    </SuccessContainer>
  );
};

export default Success;

const SuccessContainer = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background: linear-gradient(180deg, #f1e7f9 0%, #ffffff 50%, #f1e7f9 100%);
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const Header = styled.div`
  padding: 44px 20px 0;
  height: 65px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  
  img {
    width: 24px;
    height: 21px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  position: relative;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 50px;
`;

const ProfileImage = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #c8b0db;
  overflow: hidden;
  background-color: white;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProgressSection = styled.div`
  margin-top: 60px;
  position: relative;
`;

const ProgressCircle = styled.div`
  width: 272px;
  height: 272px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RingImage = styled.img`
  width: 272px;
  height: 272px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const WhiteCircleImage = styled.img`
  width: 235px;
  height: 235px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const PurpleOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #832cc5;
  opacity: 0.6;
  z-index: 3;
  border-radius: 50%;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.6;
    }
  }
`;

const ArrowIcon = styled.img`
  width: 30px;
  height: 35px;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 1s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  z-index: 4;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }
`;

const ProgressImage = styled.div<{ isRotating: boolean }>`
  width: 235px;
  height: 235px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  border: 2px solid #ffffff;
  transition: transform 0.6s ease-in-out;
  
  ${(props) =>
    props.isRotating &&
    `
    animation: rotate 0.6s ease-in-out;
  `}
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 2;
    transition: opacity 0.3s ease-in-out;
  }
  
  @keyframes rotate {
    0% {
      transform: translate(-50%, -50%) rotateY(0deg);
    }
    50% {
      transform: translate(-50%, -50%) rotateY(90deg);
    }
    100% {
      transform: translate(-50%, -50%) rotateY(180deg);
    }
  }
`;



const TargetTimeSection = styled.div`
  margin-top: 30px;
`;

const TargetTimeBox = styled.div`
  background-color: #f1e7f9;
  border-radius: 50px;
  padding: 8px 20px;
  min-width: 201px;
  text-align: center;
`;

const ActualTimeSection = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const CelebrationSection = styled.div`
  margin-top: 30px;
  text-align: center;
  padding: 0 20px;
`;

const CelebrationText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #1d1d1d;
  text-align: center;
  animation: slideUp 1s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  
  @keyframes slideUp {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`; 