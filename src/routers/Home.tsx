import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from '@components/common/flex/Flex';
import Header from '@components/common/header/Header';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { Task, TaskWithUser, StoryItem } from '../types';
import { getStoryItems, getStoryStatusColor } from '../utils/helpers';

// 임시 데이터
const mockMyTasks: Task[] = [
  {
    id: '1',
    userId: 'user1',
    title: '운동하기',
    description: '30분 러닝',
    targetTime: 30,
    startTime: new Date(Date.now() - 20 * 60 * 1000), // 20분 전 시작
    startImage: '/src/assets/icons/default.png',
    isCompleted: false,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    title: '공부하기',
    description: 'React Native 공부',
    targetTime: 120,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전 시작
    endTime: new Date(Date.now() - 30 * 60 * 1000), // 30분 전 완료
    startImage: '/src/assets/icons/default.png',
    endImage: '/src/assets/icons/default.png',
    isCompleted: true,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
];

const mockFriendTasks: TaskWithUser[] = [
  {
    id: '3',
    userId: 'user2',
    title: '요리하기',
    description: '저녁 준비',
    targetTime: 60,
    startTime: new Date(Date.now() - 45 * 60 * 1000), // 45분 전 시작
    startImage: '/src/assets/icons/default.png',
    isCompleted: false,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 'user2',
      username: 'friend1',
      nickname: '친구1',
      profileImage: '/src/assets/icons/default.png',
    },
    isViewed: false,
  },
  {
    id: '4',
    userId: 'user3',
    title: '청소하기',
    description: '방 정리',
    targetTime: 45,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전 시작
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1시간 전 완료
    startImage: '/src/assets/icons/default.png',
    endImage: '/src/assets/icons/default.png',
    isCompleted: true,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    user: {
      id: 'user3',
      username: 'friend2',
      nickname: '친구2',
      profileImage: '/src/assets/icons/default.png',
    },
    isViewed: true,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [storyItems, setStoryItems] = useState<StoryItem[]>([]);

  useEffect(() => {
    const items = getStoryItems(mockMyTasks, mockFriendTasks);
    setStoryItems(items);
  }, []);

  const handleItemClick = (task: Task | TaskWithUser) => {
    navigate('/detail');
  };

  const handleCameraClick = () => {
    navigate('/camera/start');
  };

  const renderStoryItem = (item: StoryItem) => (
    <StoryItemContainer key={item.id} onClick={() => handleItemClick(item.task)}>
      <StoryImage 
        src={item.task.startImage} 
        alt="story"
        statusColor={getStoryStatusColor(item)}
      />
      <StoryName>
        {item.isMyTask ? '나' : item.task.user.nickname}
      </StoryName>
    </StoryItemContainer>
  );

  const renderTaskItem = (task: Task | TaskWithUser) => {
    const now = new Date();
    const elapsedMs = now.getTime() - task.startTime.getTime();
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
    const isTimeExceeded = elapsedMinutes > task.targetTime;
    
    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
      return `+ ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
      <TaskItem key={task.id} onClick={() => handleItemClick(task)}>
        <TaskUserName>{'user' in task ? task.user.nickname : '나'}</TaskUserName>
        <TaskContent>
          <TaskTitle>{task.title}</TaskTitle>
          <TaskTime>{formatTime(elapsedMinutes)}</TaskTime>
        </TaskContent>
      </TaskItem>
    );
  };

  return (
    <Container>
      <Content>
        {/* 스토리 섹션 */}
        <Section>
          <ProfileHeader>
            <ProfileTextBox>
              <ProfileText>내 프로필</ProfileText>
              <ProfileText>활성화 프로필</ProfileText>
            </ProfileTextBox>
            <SettingsIcon src="/assets/settings.png" alt="설정" />
          </ProfileHeader>
          <StoryContainer>
            {storyItems.map(renderStoryItem)}
          </StoryContainer>
        </Section>

        {/* 구분선 */}
        <Divider />

        {/* 내 할 일 섹션 */}
        <Section>
          <ProgressHeader>
            <SectionTitle>진행 목록</SectionTitle>
            <RefreshIcon src="/assets/refresh.png" alt="새로고침" />
          </ProgressHeader>
          <TaskList>
            {mockMyTasks.map(renderTaskItem)}
          </TaskList>
        </Section>

        {/* 친구 할 일 섹션 */}
        <Section>
          <SectionTitle>친구</SectionTitle>
          <TaskList>
            {mockFriendTasks.map(renderTaskItem)}
          </TaskList>
        </Section>
      </Content>

      {/* 우측 하단 고정 카메라 버튼 */}
      <CameraButton onClick={handleCameraClick}>
        <CameraIcon src="/assets/camera.png" alt="카메라" />
      </CameraButton>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: ${colors.white};
  margin: 0 auto;
  position: relative;
`;

const Content = styled.div`
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 60px);
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.textBlack};
  margin-bottom: 15px;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ProfileTextBox = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: -30px;
`;

const ProfileText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.textBlack};
  font-family: 'Noto Sans KR', sans-serif;
`;

const SettingsIcon = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgb(205, 156, 209);
  width: 100%;
  width: calc(100% + 40px);
  margin: 0 -20px 40px -20px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const RefreshIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const StoryContainer = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  margin-bottom: -10px;
`;

const StoryItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 60px;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const StoryImage = styled.img<{ statusColor: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ statusColor }) => statusColor};
`;

const StoryName = styled.span`
  font-size: 12px;
  color: ${colors.textBlack};
  text-align: center;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #fafafa;
  }
`;

const TaskUserName = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${colors.textBlack};
  font-family: 'Noto Sans KR', sans-serif;
`;

const TaskContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 36px;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-radius: 50px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
`;

const TaskTitle = styled.h3`
  font-size: 14px;
  font-weight: 400;
  color: ${colors.textBlack};
  margin: 0;
  font-family: 'Noto Sans KR', sans-serif;
`;

const TaskTime = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #7c3aed;
  font-family: 'Noto Sans KR', sans-serif;
`;

const CameraButton = styled.button`
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 71px;
  height: 71px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CameraIcon = styled.img`
  width: 71px;
  height: 71px;
  object-fit: contain;
`;
