import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { Task, TaskWithUser, StoryItem } from '../../types';
import { getStoryItems, getStoryStatusColor } from '../../utils/helpers';
import settingsIcon from '../../assets/icons/home/setting.svg';
import refreshIcon from '../../assets/icons/home/refresh.svg';
import cameraIcon from '../../assets/icons/home/shoot.svg';
import profileIcon from '../../assets/icons/home/profile.svg';
import useTimer from '../../hooks/useTimer';

// 임시 데이터
const mockMyTasks: Task[] = [
  {
    id: '1',
    userId: 'user1',
    title: '운동하기',
    description: '30분 러닝',
    targetTime: 30,
    startTime: new Date(Date.now() - 20 * 60 * 1000), // 20분 전 시작
    startImage: profileIcon,
    isCompleted: false,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockFriendTasks: TaskWithUser[] = [
  {
    id: '2',
    userId: 'user2',
    title: '요리하기',
    description: '저녁 준비',
    targetTime: 60,
    startTime: new Date(Date.now() - 45 * 60 * 1000), // 45분 전 시작
    startImage: profileIcon,
    isCompleted: false,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 'user2',
      username: 'friend1',
      nickname: '친구1',
      profileImage: profileIcon,
    },
    isViewed: false,
  },
  {
    id: '3',
    userId: 'user3',
    title: '청소하기',
    description: '방 정리',
    targetTime: 45,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전 시작
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1시간 전 완료
    startImage: profileIcon,
    endImage: profileIcon,
    isCompleted: true,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    user: {
      id: 'user3',
      username: 'friend2',
      nickname: '친구2',
      profileImage: profileIcon,
    },
    isViewed: true,
  },
  {
    id: '4',
    userId: 'user4',
    title: '운동하기',
    description: '헬스장 가기',
    targetTime: 90,
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30분 전 시작
    startImage: profileIcon,
    isCompleted: false,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 'user4',
      username: 'friend3',
      nickname: '친구3',
      profileImage: profileIcon,
    },
    isViewed: false,
  },
  {
    id: '5',
    userId: 'user5',
    title: '독서하기',
    description: '책 읽기',
    targetTime: 120,
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3시간 전 시작
    endTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5시간 전 완료
    startImage: profileIcon,
    endImage: profileIcon,
    isCompleted: true,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    user: {
      id: 'user5',
      username: 'friend4',
      nickname: '친구4',
      profileImage: profileIcon,
    },
    isViewed: true,
  },
  {
    id: '6',
    userId: 'user6',
    title: '게임하기',
    description: '롤 게임',
    targetTime: 60,
    startTime: new Date(Date.now() - 15 * 60 * 1000), // 15분 전 시작
    startImage: profileIcon,
    isCompleted: false,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 'user6',
      username: 'friend5',
      nickname: '친구5',
      profileImage: profileIcon,
    },
    isViewed: false,
  },
  {
    id: '7',
    userId: 'user7',
    title: '쇼핑하기',
    description: '온라인 쇼핑',
    targetTime: 30,
    startTime: new Date(Date.now() - 10 * 60 * 1000), // 10분 전 시작
    startImage: profileIcon,
    isCompleted: false,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 'user7',
      username: 'friend6',
      nickname: '친구6',
      profileImage: profileIcon,
    },
    isViewed: false,
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
    // 내 태스크인지 확인 ('user' 속성이 없으면 내 태스크)
    const isMyTask = !('user' in task);
    navigate(`/detail?isMe=${isMyTask}`);
  };

  const handleStoryItemClick = (item: StoryItem) => {
    // 스토리 아이템의 isMyTask 속성을 사용
    navigate(`/detail?isMe=${item.isMyTask}`);
  };

  const handleCameraClick = () => {
    navigate('/camera/start');
  };

  const handleSettingsClick = () => {
    navigate('/mypage');
  };

  const renderStoryItem = (item: StoryItem) => (
    <StoryItemContainer key={item.id} onClick={() => handleStoryItemClick(item)}>
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

  const TaskTimer = ({ task }: { task: Task | TaskWithUser }) => {
    const now = new Date();
    const elapsedMs = now.getTime() - task.startTime.getTime();
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
    
    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
      return `+ ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // 1초마다 업데이트
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    const currentElapsedMs = currentTime.getTime() - task.startTime.getTime();
    const currentElapsedMinutes = Math.floor(currentElapsedMs / (1000 * 60));

    return <TaskTime>{formatTime(currentElapsedMinutes)}</TaskTime>;
  };

  const renderTaskItem = (task: Task | TaskWithUser) => {
    return (
      <TaskItem key={task.id} onClick={() => handleItemClick(task)}>
        <TaskUserName>{'user' in task ? task.user.nickname : '강연주'}</TaskUserName>
        <TaskContent>
          <TaskTitle>{task.title}</TaskTitle>
          <TaskTimer task={task} />
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
            <SettingsIcon src={settingsIcon} alt="설정" onClick={handleSettingsClick} />
          </ProfileHeader>
          <StoryContainer>
            {/* 내 스토리 - 고정 */}
            {storyItems.filter(item => item.isMyTask).map(renderStoryItem)}
            {/* 친구 스토리 - 스크롤 */}
            <FriendStoryContainer>
              {storyItems.filter(item => !item.isMyTask).map(renderStoryItem)}
            </FriendStoryContainer>
          </StoryContainer>
        </Section>

        {/* 구분선 */}
        <Divider />

        {/* 내 할 일 섹션 */}
        <Section>
          <ProgressHeader>
            <SectionTitle>진행 목록</SectionTitle>
          </ProgressHeader>
          <TaskList>
            {mockMyTasks.map(renderTaskItem)}
          </TaskList>
        </Section>

        {/* 친구 할 일 섹션 */}
        <Section>
          <SectionTitle>친구</SectionTitle>
          <FriendTaskList>
            {mockFriendTasks.map(renderTaskItem)}
          </FriendTaskList>
        </Section>
      </Content>

      {/* 우측 하단 고정 카메라 버튼 */}
      <CameraButton onClick={handleCameraClick}>
        <CameraIcon src={cameraIcon} alt="카메라" />
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
  height: calc(100vh - 60px);
  overflow: hidden;
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
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
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
  margin-bottom: -10px;
  padding-top: 3px;
`;

const FriendStoryContainer = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  flex: 1;
  padding: 20px 0;
  margin: -20px -20px -20px 0;
  width: calc(100% + 20px);
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

const FriendTaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding-bottom: 50px;
  
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
  gap: 16px;
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
  min-width: 90px;
  width: 90px;
  text-align: right;
  display: inline-block;
  white-space: nowrap;
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
  width: 80px;
  height: 80px;
  object-fit: contain;
`;
