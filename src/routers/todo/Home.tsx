import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { Task, TaskWithUser, UserWithStories, Story } from '../../types';
import settingsIcon from '../../assets/icons/home/setting.svg';
import refreshIcon from '../../assets/icons/home/refresh.svg';
import cameraIcon from '../../assets/icons/home/shoot.svg';
import profileIcon from '../../assets/icons/home/profile.svg';
import useTimer from '../../hooks/useTimer';
import StoryViewer from './StoryViewer';

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
    userId: 'user2',
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
      id: 'user2',
      username: 'friend1',
      nickname: '친구1',
      profileImage: profileIcon,
    },
    isViewed: true,
  },
  {
    id: '4',
    userId: 'user3',
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
      id: 'user3',
      username: 'friend2',
      nickname: '친구2',
      profileImage: profileIcon,
    },
    isViewed: false,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [usersWithStories, setUsersWithStories] = useState<UserWithStories[]>([]);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  useEffect(() => {
    const myUser = {
      id: 'user1',
      username: 'me',
      nickname: '나',
      profileImage: profileIcon,
    };

    const myStories: Story[] = mockMyTasks.map((task, index) => ({
      id: `story-my-${index}`,
      task: task,
      timestamp: task.startTime,
    }));

    const myStoriesWithUser: UserWithStories = {
      user: myUser,
      stories: myStories,
      isMyStories: true,
    };

    const friendStoriesGrouped = mockFriendTasks.reduce((acc, taskWithUser) => {
      const { user, isViewed, ...task } = taskWithUser;
      if (!acc[user.id]) {
        acc[user.id] = {
          user: user,
          stories: [],
          isMyStories: false,
        };
      }
      acc[user.id].stories.push({
        id: `story-friend-${task.id}`,
        task: task,
        timestamp: task.startTime,
        isViewed: isViewed,
      });
      return acc;
    }, {} as { [key: string]: UserWithStories });

    const friendUsersWithStories = Object.values(friendStoriesGrouped);

    setUsersWithStories([myStoriesWithUser, ...friendUsersWithStories]);
  }, []);

  const handleItemClick = (task: Task | TaskWithUser) => {
    const isMyTask = !('user' in task);
    navigate(`/detail?isMe=${isMyTask}`);
  };

  const handleStoryItemClick = (userIndex: number) => {
    setSelectedUserIndex(userIndex);
    setShowStoryViewer(true);
  };

  const handleCloseStoryViewer = () => {
    setShowStoryViewer(false);
  };

  const handleCameraClick = () => {
    navigate('/camera/start');
  };

  const handleSettingsClick = () => {
    navigate('/mypage');
  };

  const renderStoryItem = (userWithStories: UserWithStories, index: number) => {
    const { user, stories, isMyStories } = userWithStories;

    const hasUnviewedStory = !isMyStories && stories.some(story => !story.isViewed);

    const getStatusColor = (): string => {
      if (isMyStories) {
        return '#71d596'; // green
      }
      if (hasUnviewedStory) {
        return '#71d596'; // green
      }
      return '#bababa'; // grey
    };

    return (
        <StoryItemContainer key={user.id} onClick={() => handleStoryItemClick(index)}>
        <StoryImage 
            src={user.profileImage} 
            alt="story"
            statusColor={getStatusColor()}
        />
        <StoryName>
            {user.nickname}
        </StoryName>
        </StoryItemContainer>
    );
  }

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
            {usersWithStories.map((item, index) => renderStoryItem(item, index))}
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
        <Section style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, marginBottom: 0 }}>
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

      {/* 스토리 뷰어 */}
      {showStoryViewer && (
        <StoryViewerOverlay>
          <StoryViewer
            usersWithStories={usersWithStories}
            initialUserIndex={selectedUserIndex}
            onClose={handleCloseStoryViewer}
          />
        </StoryViewerOverlay>
      )}
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
  overflow: hidden;
`;

const Content = styled.div`
  padding: 20px 20px 0 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  margin-bottom: 30px;
  flex-shrink: 0;
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
  overflow-x: auto;
  padding: 20px 0;
  margin: -20px -20px -20px 0;
  width: calc(100% + 20px);
  
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
  flex: 1;
  overflow-y: auto;
  
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

const StoryViewerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
