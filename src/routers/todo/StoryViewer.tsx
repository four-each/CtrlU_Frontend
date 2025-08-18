import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useSwipeable } from 'react-swipeable';
import { colors } from '@styles/theme';
import { UserWithStories, Story } from '../../types';
import { Col, Row } from '@components/common/flex/Flex';
import { formatTime } from '../../utils/helpers';
import Header from '@components/common/header/Header';
import Txt from '@components/common/Txt';
import Timer, { FinishHandler } from '@components/timer/Timer';
import backArrowIcon from '../../assets/icons/detail/backArrow.svg';
import leftArrowIcon from '../../assets/icons/detail/arrow_left.svg';
import rightArrowIcon from '../../assets/icons/detail/arrow_right.svg';

interface StoryViewerProps {
  usersWithStories: UserWithStories[];
  initialUserIndex?: number;
  onClose: () => void;
}

const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const StoryViewer: React.FC<StoryViewerProps> = ({ 
  usersWithStories, 
  initialUserIndex = 0, 
  onClose 
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animation, setAnimation] = useState<'left' | 'right' | 'none'>('none');
  const navigate = useNavigate();
  const progressInterval = useRef<number | null>(null);
  const finishHandler = useRef<FinishHandler>(null);
  const STORY_DURATION = 3000; // 3초

  const currentUser = usersWithStories[currentUserIndex];
  const currentStory = currentUser.stories[currentStoryIndex];

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();

    progressInterval.current = setInterval(() => {
      const now = Date.now();
      const newProgress = Math.min(((now - startTime) / STORY_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        if (currentStoryIndex < currentUser.stories.length - 1) {
          setCurrentStoryIndex(currentStoryIndex + 1);
        } else {
          onClose();
        }
      }
    }, 16);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentUserIndex, currentStoryIndex, isPaused, usersWithStories, onClose]);

  useEffect(() => {
    setProgress(0);
    if (animation !== 'none') {
      const timer = setTimeout(() => setAnimation('none'), 500);
      return () => clearTimeout(timer);
    }
  }, [currentUserIndex]);

  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex]);

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };

  const handlePreviousUser = () => {
    if (currentUserIndex > 0) {
      setAnimation('left');
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(0);
    }
  };

  const handleNextUser = () => {
    if (currentUserIndex < usersWithStories.length - 1) {
      setAnimation('right');
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextUser(),
    onSwipedRight: () => handlePreviousUser(),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  const handleProgressBarClick = (index: number) => {
    setCurrentStoryIndex(index);
  };

  const showLeftArrow = currentStoryIndex > 0;
  const showRightArrow = currentStoryIndex < currentUser.stories.length - 1;

  return (
    <Container {...swipeHandlers}>
      <AnimatedCol align="center" animation={animation}>
        <Header
          isBack={true}
          isRight={false}
          title=""
          userName={currentUser.user.nickname}
          onBack={onClose}
        />
        
        <ProgressBarContainer>
          {currentUser.stories.map((_, index) => (
            <ProgressBarItem key={index} onClick={() => handleProgressBarClick(index)}>
              <ProgressBar
                isActive={index === currentStoryIndex}
                progress={index === currentStoryIndex ? progress : (index < currentStoryIndex ? 100 : 0)}
              />
            </ProgressBarItem>
          ))}
        </ProgressBarContainer>

        <ContentContainer>
          <SmallImage src={currentStory.task.startImage} alt="smallImage" />
          <Txt
            fontSize="24px"
            fontWeight={500}
            color={colors.textBlack}
            letterSpacing="0.0024rem"
          >
            {currentStory.task.title}
          </Txt>
        </ContentContainer>
        
        <Timer
          durationTime={currentStory.task.targetTime * 60 * 1000}
          endTime={formatTime(currentStory.task.targetTime)}
          timerRef={finishHandler}
        />

        {showLeftArrow && (
          <NavigationButton position="left" onClick={handlePrevious}>
            <ArrowIcon src={leftArrowIcon} alt="이전" />
          </NavigationButton>
        )}
        
        {showRightArrow && (
          <NavigationButton position="right" onClick={handleNext}>
            <ArrowIcon src={rightArrowIcon} alt="다음" />
          </NavigationButton>
        )}
      </AnimatedCol>
    </Container>
  );
};

export default StoryViewer;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: ${colors.purple1};
  margin: 0 auto;
`;

const AnimatedCol = styled(Col)<{ animation: 'left' | 'right' | 'none' }>`
  height: 100%;
  animation: ${({ animation }) => animation === 'left' ? slideInLeft : animation === 'right' ? slideInRight : 'none'} 0.5s forwards;
  padding-bottom: 40px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
  gap: 15px;
`;

const ProgressBarContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 20px;
  width: 100%;
`;

const ProgressBarItem = styled.div`
  flex: 1;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
`;

const ProgressBar = styled.div<{ isActive: boolean; progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: ${({ isActive }) => isActive ? colors.purple3 : colors.purple3};
  transition: width 0.1s ease;
`;

const SmallImage = styled.img`
  width: 35px;
  height: 35px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  background-color: ${colors.purple1};
  border: 2px solid ${colors.purple1};
`;

const NavigationButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ position }) => position}: 20px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 10;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const ArrowIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
`;
