import React, { useState, useRef, useEffect } from 'react';
import { Col } from '@components/common/flex/Flex';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { useNavigate, useLocation } from 'react-router-dom';
import cancelIcon from '../../assets/icons/detail/cancel.svg';
import profileIcon from '../../assets/icons/home/profile.svg';
import ganadiIcon from '../../assets/icons/detail/ganadi.svg';
import ringIcon from '../../assets/icons/detail/ring.svg';
import whiteCircleIcon from '../../assets/icons/detail/whiteCircle.svg';
import arrowIcon from '../../assets/icons/detail/arrow.svg';
import { useGetTodoDetail } from '../../hooks/api/todo/useGetTodoDetail';
import { useQueryClient } from '@tanstack/react-query';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { todoId } = location.state || {};

  const { data: todoDetailData, isLoading, isError } = useGetTodoDetail(todoId);

  const [isStartImageVisible, setIsStartImageVisible] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [showPurpleOverlay, setShowPurpleOverlay] = useState(false);
  const overlayTimerRef = useRef<number | null>(null);

  const todoInfo = todoDetailData?.result;
  const imageToShow = isStartImageVisible ? todoInfo?.startImage : todoInfo?.endImage;

  useEffect(() => {
    if (imageToShow) {
      overlayTimerRef.current = setTimeout(() => {
        setShowPurpleOverlay(true);
      }, 1000);
    }
    return () => {
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
      }
    };
  }, [imageToShow]);

  const handleBack = () => {
    queryClient.invalidateQueries({ queryKey: ['myTodos'] });
    navigate('/');
  };

  const handleImageClick = () => {
    if (!todoInfo?.startImage || !todoInfo?.endImage) return;

    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
    }

    setShowPurpleOverlay(false);
    setIsRotating(true);

    setTimeout(() => {
      setIsStartImageVisible(prevState => !prevState);
      setIsRotating(false);
      
      overlayTimerRef.current = setTimeout(() => {
        setShowPurpleOverlay(true);
      }, 1000);
    }, 300);
  };

  if (isLoading) {
    return <Txt>로딩 중...</Txt>;
  }

  if (isError || !todoInfo) {
    return <Txt>데이터를 불러오는 데 실패했습니다.</Txt>;
  }

  return (
    <SuccessContainer>
      <Header>
        <BackButton onClick={handleBack}>
          <img src={cancelIcon} alt="취소" />
        </BackButton>
      </Header>

      <MainContent>
        <ProfileSection>
          <ProfileImage>
            <img src={todoInfo.profileImage || profileIcon} alt="프로필" />
          </ProfileImage>
          <Txt fontSize="22px" fontWeight={500} color="#1d1d1d">
            {todoInfo.title}
          </Txt>
        </ProfileSection>

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
                src={imageToShow || ganadiIcon} 
                alt={imageToShow ? "미션 사진" : "기본 이미지"} 
              />
              {showPurpleOverlay && (
                <PurpleOverlay />
              )}
            </ProgressImage>
            {showPurpleOverlay && (todoInfo.startImage && todoInfo.endImage) && (
              <ArrowIcon 
                src={arrowIcon} 
                alt="화살표" 
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}
              />
            )}
          </ProgressCircle>
        </ProgressSection>

        <TargetTimeSection>
          <TargetTimeBox>
            <Txt fontSize="14px" fontWeight={400} color="#1d1d1d">
              목표 시간: {todoInfo.challengeTime}
            </Txt>
          </TargetTimeBox>
        </TargetTimeSection>

        <ActualTimeSection>
          <Txt fontSize="60px" fontWeight={500} color="#832cc5">
            {new Date(todoInfo.durationTime).toISOString().substr(11, 8)}
          </Txt>
        </ActualTimeSection>

        <CelebrationSection>
          <CelebrationText>
            우와, 목표를 이루셨군요 
            정말 대단해요!☺️
          </CelebrationText>
        </CelebrationSection>
      </MainContent>
    </SuccessContainer>
  );
};

export default Success;

// Styled Components remain the same...

const SuccessContainer = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  min-height: 100dvh;
  min-height: -webkit-fill-available;
  background: linear-gradient(180deg, #f1e7f9 0%, #ffffff 30%, #f1e7f9 100%);
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  position: relative;
  
  @media (max-aspect-ratio: 9/16) {
    background: linear-gradient(180deg, #f1e7f9 0%, #ffffff 25%, #f1e7f9 100%);
    background-attachment: fixed;
  }
  
  @media (min-aspect-ratio: 9/16) and (max-aspect-ratio: 1/1) {
    background: linear-gradient(180deg, #f1e7f9 0%, #ffffff 35%, #f1e7f9 100%);
    background-attachment: fixed;
  }
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
  margin-top: 8vh;
  
  @media (max-aspect-ratio: 9/16) {
    margin-top: 6vh;
  }
  
  @media (min-aspect-ratio: 9/16) and (max-aspect-ratio: 1/1) {
    margin-top: 10vh;
  }
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
  margin-top: 8vh;
  position: relative;
  
  @media (max-aspect-ratio: 9/16) {
    margin-top: 6vh;
  }
  
  @media (min-aspect-ratio: 9/16) and (max-aspect-ratio: 1/1) {
    margin-top: 10vh;
  }
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
  margin-top: 4vh;
  
  @media (max-aspect-ratio: 9/16) {
    margin-top: 3vh;
  }
  
  @media (min-aspect-ratio: 9/16) and (max-aspect-ratio: 1/1) {
    margin-top: 5vh;
  }
`;

const TargetTimeBox = styled.div`
  background-color: #f1e7f9;
  border-radius: 50px;
  padding: 8px 20px;
  min-width: 201px;
  text-align: center;
`;

const ActualTimeSection = styled.div`
  margin-top: 2vh;
  text-align: center;
  
  @media (max-aspect-ratio: 9/16) {
    margin-top: 1.5vh;
  }
  
  @media (min-aspect-ratio: 9/16) and (max-aspect-ratio: 1/1) {
    margin-top: 3vh;
  }
`;

const CelebrationSection = styled.div`
  margin-top: 4vh;
  margin-bottom: 10vh;
  text-align: center;
  padding: 0 20px;
  
  @media (max-aspect-ratio: 9/16) {
    margin-top: 3vh;
    margin-bottom: 6vh;
  }
  
  @media (min-aspect-ratio: 9/16) and (max-aspect-ratio: 1/1) {
    margin-top: 5vh;
    margin-bottom: 3vh;
  }
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