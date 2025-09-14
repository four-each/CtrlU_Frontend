import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';
import { useSwipeable } from 'react-swipeable';
import { colors } from '@styles/theme';
import Txt from '@components/common/Txt';
import { StoryUser } from '../todo/api/GetStoriesApi';
import { useGetStoryDetail } from '../../hooks/api/story/useGetStoryDetail';
import { getUserId } from '../../utils/auth';
import Timer from '../../components/timer/Timer';
import backArrow from '../../assets/icons/detail/backArrow.svg';
import ringIcon from '../../assets/icons/detail/ring.svg';
import whiteCircleIcon from '../../assets/icons/detail/whiteCircle.svg';
import arrowIcon from '../../assets/icons/detail/arrow.svg';
import ganadiIcon from '../../assets/icons/detail/ganadi.svg';
import profileIcon from '../../assets/icons/home/profile.svg';
import nextIcon from '../../assets/icons/detail/next.svg';
import prevIcon from '../../assets/icons/detail/prev.svg';

interface StoryViewerProps {
  users: StoryUser[];
  initialUserIndex?: number;
  onClose: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const progressBarAnimation = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

const StoryViewer: React.FC<StoryViewerProps> = ({
  users,
  initialUserIndex = 0,
  onClose,
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [nowId, setNowId] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0); // 0-based index for stories of the current user

  const [isStartImageVisible, setIsStartImageVisible] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [showPurpleOverlay, setShowPurpleOverlay] = useState(false);
  const overlayTimerRef = useRef<number | null>(null);

  const currentUser = users[currentUserIndex];
  const myUserId = getUserId();

  const { data: storyDetailData, isLoading, isError } = useGetStoryDetail(
    currentUser?.id || 0,
    nowId,
    !!currentUser && !!myUserId
  );

  const storyDetail = storyDetailData?.result;

  useEffect(() => {
    const currentUser = users[currentUserIndex];
    if (currentUser && currentUser.id === myUserId && currentUser.status === 'NONE') {
      onClose();
    }
  }, [currentUserIndex, users, onClose, myUserId]);

  // When the user changes, reset the story progress
  useEffect(() => {
    setNowId(0);
    setStoryIndex(0);
  }, [currentUserIndex]);

  // Image transition effect
  useEffect(() => {
    if (storyDetail?.startImage && storyDetail?.endImage) {
      overlayTimerRef.current = setTimeout(() => {
        setShowPurpleOverlay(true);
      }, 1000);
    }
    return () => {
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
      }
    };
  }, [storyDetail?.startImage, storyDetail?.endImage]);

  const handleNext = useCallback(() => {
    if (storyDetail?.nextId) {
      setNowId(storyDetail.nextId);
      setStoryIndex(prev => prev + 1);
    } else {
      if (currentUserIndex < users.length - 1) {
        setCurrentUserIndex(prev => prev + 1);
      } else {
        onClose();
      }
    }
  }, [storyDetail, currentUserIndex, users, onClose]);

  const handlePrevious = () => {
    if (storyDetail?.prevId) {
      setNowId(storyDetail.prevId);
      setStoryIndex(prev => prev - 1);
    } else {
      if (currentUserIndex > 0) {
        setCurrentUserIndex(prev => prev - 1);
      }
    }
  };

  const handleNextUser = useCallback(() => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
    } else {
      onClose();
    }
  }, [currentUserIndex, users.length, onClose]);

  const handlePreviousUser = useCallback(() => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
    }
  }, [currentUserIndex]);

  const handleImageClick = () => {
    if (!storyDetail?.startImage || !storyDetail?.endImage) return;

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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextUser,
    onSwipedRight: handlePreviousUser,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (!currentUser) {
    onClose();
    return null;
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Txt fontSize="18px" color={colors.white}>로딩 중...</Txt>
        </LoadingContainer>
      </Container>
    );
  }

  if (isError || !storyDetail) {
    return (
      <Container>
        <LoadingContainer>
          <Txt fontSize="18px" color={colors.white}>스토리를 불러올 수 없습니다.</Txt>
        </LoadingContainer>
      </Container>
    );
  }

  const imageToShow = isStartImageVisible ? storyDetail.startImage : storyDetail.endImage;
  const hasBothImages = storyDetail.startImage && storyDetail.endImage;

  return (
    <Container {...swipeHandlers}>
      <AnimatedContent key={currentUserIndex}>
        <Header>
          <BackButton onClick={onClose}>
            <img src={backArrow} alt="뒤로가기" />
          </BackButton>
          <UserName>{currentUser.id === myUserId ? '나' : storyDetail.userName || `친구 ${currentUser.id}`}</UserName>
          <div style={{ width: '24px' }} />
        </Header>

        <ProgressBarContainer>
          {Array.from({ length: storyDetail.totalCount }).map((_, index) => (
            <ProgressBarItem key={index}>
              <ProgressBar
                key={`${currentUserIndex}-${nowId}`}
                isViewed={index < storyIndex}
                isActive={index === storyIndex}
                onAnimationEnd={index === storyIndex ? handleNext : undefined}
              />
            </ProgressBarItem>
          ))}
        </ProgressBarContainer>

        <MainContent>
          <ProfileSection>
            <ProfileImage>
              <img src={storyDetail.profileImage || profileIcon} alt="프로필" />
            </ProfileImage>
            <Txt fontSize="22px" fontWeight={500} color="#1d1d1d">
              {storyDetail.title}
            </Txt>
          </ProfileSection>

          {storyDetail.status !== 'IN_PROGRESS' && (
            <ProgressSection>
              <ProgressCircle>
                <RingImage src={ringIcon} alt="프로그레스 링" />
                <WhiteCircleImage src={whiteCircleIcon} alt="흰색 원 배경" />
                <ProgressImage 
                  onClick={hasBothImages ? handleImageClick : undefined}
                  style={{ cursor: hasBothImages ? 'pointer' : 'default' }}
                  isRotating={isRotating}
                >
                  <img 
                    src={imageToShow || ganadiIcon} 
                    alt={imageToShow ? "미션 사진" : "기본 이미지"} 
                  />
                  {showPurpleOverlay && hasBothImages && (
                    <PurpleOverlay />
                  )}
                </ProgressImage>
                {showPurpleOverlay && hasBothImages && (
                  <ArrowIcon 
                    src={arrowIcon} 
                    alt="화살표" 
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </ProgressCircle>
            </ProgressSection>
          )}

          {storyDetail.status === 'IN_PROGRESS' ? (
            <TimerSection>
              <Timer 
                durationTime={storyDetail.durationTime}
                challengeTime={storyDetail.challengeTime}
                centerImageSrc={storyDetail.startImage}
                textColor="#832CC5"
              />
            </TimerSection>
          ) : (
            <>
              <TargetTimeSection>
                <TargetTimeBox>
                  <Txt fontSize="14px" fontWeight={400} color="#1d1d1d">
                    목표 시간: {storyDetail.challengeTime}
                  </Txt>
                </TargetTimeBox>
              </TargetTimeSection>

              <ActualTimeSection>
                <ActualTimeText>
                  {new Date(storyDetail.durationTime).toISOString().substr(11, 8)}
                </ActualTimeText>
              </ActualTimeSection>
            </>
          )}

        </MainContent>
      </AnimatedContent>

      {storyDetail.prevId !== null && (
        <NavButton position="left" onClick={handlePrevious}>
          <img src={prevIcon} alt="이전" />
        </NavButton>
      )}
      {storyDetail.nextId !== null && (
        <NavButton position="right" onClick={handleNext}>
          <img src={nextIcon} alt="다음" />
        </NavButton>
      )}
    </Container>
  );
};

export default StoryViewer;

// Styled Components

const AnimatedContent = styled.div`
  animation: ${fadeIn} 0.4s ease-in-out;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: #C8B0DB;
  margin: 0 auto;
  overflow-y: scroll;
  position: relative;
`;

const Header = styled.div`
  padding: 44px 20px 0;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background-color: #C8B0DB;
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

const UserName = styled.h1`
  color: #1d1d1d;
  font-size: 18px;
  font-weight: 500;
  font-family: 'Noto Sans KR', sans-serif;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const ProgressBarContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px 16px 12px 16px;
  width: 100%;
  margin-top: 20px;
  background-color: #C8B0DB;
`;

const ProgressBarItem = styled.div`
  flex: 1;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ isActive: boolean; isViewed: boolean; }>`
  height: 100%;
  background-color: #832cc5;
  width: ${({ isViewed }) => (isViewed ? '100%' : '0%')};
  ${({ isActive }) =>
    isActive &&
    css`
      animation: ${progressBarAnimation} 5s linear forwards;
    `}
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  padding-bottom: 50px;
  position: relative;
  background-color: #C8B0DB;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
  margin-bottom: 25px;
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
  margin-top: 15px;
  position: relative;
`;

const TimerSection = styled.div`
  margin-top: 15px;
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
    from { opacity: 0; }
    to { opacity: 0.6; }
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
    0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
    40% { transform: translateX(-50%) translateY(-10px); }
    60% { transform: translateX(-50%) translateY(-5px); }
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
  
  ${(props) => props.isRotating && `animation: rotate 0.6s ease-in-out;`}
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 2;
    transition: opacity 0.3s ease-in-out;
  }
  
  @keyframes rotate {
    0% { transform: translate(-50%, -50%) rotateY(0deg); }
    50% { transform: translate(-50%, -50%) rotateY(90deg); }
    100% { transform: translate(-50%, -50%) rotateY(180deg); }
  }
`;

const TargetTimeSection = styled.div`
  margin-top: 4vh;
`;

const TargetTimeBox = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 8px 20px;
  min-width: 201px;
  text-align: center;
`;

const ActualTimeSection = styled.div`
  margin-top: 2vh;
  text-align: center;
`;

const ActualTimeText = styled.div`
  font-size: 60px;
  font-weight: 500;
  color: #832CC5;
  letter-spacing: 0.06rem;
  text-align: center;
`;

const NavButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ position }) => position}: 20px;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  background: none;
  padding: 0;
  
  img {
    width: 32px;
    height: 32px;
    display: block;
    filter: brightness(1.5) contrast(1.2);
  }
`;