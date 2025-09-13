import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import type { GetMyTodosResponse } from './api/GetMyTodosApi';
import settingsIcon from '../../assets/icons/home/setting.svg';
import cameraIcon from '../../assets/icons/home/shoot.svg';
import profileIcon from '../../assets/icons/home/profile.svg';
import { useGetMyTodos } from '../../hooks/api/todo/useGetMyTodos';
import { useGetFriendTodos } from '../../hooks/api/todo/useGetFriendTodos';
import type { FriendTodo, GetFriendTodosResponse } from './api/GetFriendTodosApi';
import { useGetStories } from '../../hooks/api/story/useGetStories';
import { StoryUser, StoryStatusType } from './api/GetStoriesApi';
import StoryViewer from './StoryViewer';

// Helper to format duration from seconds to + HH:MM:SS
const formatDuration = (totalSeconds: number) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '+ 00:00:00';
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `+ ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Home = () => {
  const navigate = useNavigate();
  const [showInProgressModal, setShowInProgressModal] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const { data: myTodosResponse, isLoading: myTodosLoading, isError: myTodosError } = useGetMyTodos('IN_PROGRESS', 'me');

  useEffect(() => {
    if (myTodosError) {
      console.error('[Home] 내 할일 조회 에러', myTodosError);
    }
  }, [myTodosError]);

  const TickingTaskTimer = ({ initialSeconds }: { initialSeconds: number }) => {
    const [seconds, setSeconds] = useState<number>(initialSeconds);
    useEffect(() => {
      const intervalId = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }, []);
    return <TaskTime>{formatDuration(seconds)}</TaskTime>;
  };

  const renderMyTodoItem = (todo: { id: number; todoName: string; userName: string; durationTime: number; }) => (
    <TaskItem key={todo.id} onClick={() => navigate(`/detail?isMe=true&id=${todo.id}`)}>
      <TaskUserName>{todo.userName}</TaskUserName>
      <TaskContent>
        <TaskTitle>{todo.todoName}</TaskTitle>
        <TickingTaskTimer initialSeconds={Math.floor(todo.durationTime / 1000)} />
      </TaskContent>
    </TaskItem>
  );

  // 친구 진행 목록 무한 스크롤
  const {
    data: friendPages,
    hasNextPage: friendHasNext,
    fetchNextPage: fetchNextFriend,
    isFetchingNextPage: friendFetchingNext,
    isLoading: friendLoading,
    isError: friendError,
  } = useGetFriendTodos({ pageSize: 10 });

  const flatFriendTodos: FriendTodo[] = friendPages?.pages.flatMap(p => p.result.todos) || [];

  const renderFriendTodoItem = (todo: FriendTodo) => (
    <TaskItem key={todo.id} onClick={() => navigate(`/detail?isMe=false&id=${todo.id}`)}>
      <TaskUserName>{todo.userName}</TaskUserName>
      <TaskContent>
        <TaskTitle>{todo.todoName}</TaskTitle>
        <TickingTaskTimer initialSeconds={Math.floor(todo.durationTime / 1000)} />
      </TaskContent>
    </TaskItem>
  );

  // New Story API Integration
  const {
    data: storyData,
    fetchNextPage: fetchNextStoryPage,
    hasNextPage: hasNextStoryPage,
    isFetchingNextPage: isFetchingNextStoryPage,
    isLoading: isStoryLoading,
    isError: isStoryError,
  } = useGetStories();

  const myStoryInfo: StoryUser | undefined = storyData?.pages[0]?.result.me;
  const friendStoryInfos: StoryUser[] = storyData?.pages.flatMap(page => page.result.friends) || [];
  const allStoryUsers = myStoryInfo ? [myStoryInfo, ...friendStoryInfos] : [];

  const getStatusBorderColor = (status: StoryStatusType): string => {
    switch (status) {
      case "NONE": return colors.gray;
      case "GREEN": return colors.purple3;
      case "GRAY":
        return colors.gray;
      case "RED": return colors.red;
      default: return colors.gray;
    }
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastStoryElementRef = useCallback((node: HTMLDivElement) => {
    if (isFetchingNextStoryPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextStoryPage) {
        fetchNextStoryPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetchingNextStoryPage, hasNextStoryPage, fetchNextStoryPage]);

  const handleStoryItemClick = (index: number) => {
    // 내 스토리(index 0)를 클릭했을 때 스토리가 비어있으면 카메라로 이동
    if (index === 0 && myStoryInfo && myStoryInfo.status === "NONE") {
      navigate('/camera/start');
      return;
    }
    
    setSelectedUserIndex(index);
    setShowStoryViewer(true);
  };

  const handleCloseStoryViewer = () => {
    setShowStoryViewer(false);
  };

  const handleCameraClick = () => {
    const myInProgressTodosCount = myTodosResponse?.result.totalElementCount || 0;
    if (myInProgressTodosCount > 0) {
      setShowInProgressModal(true);
    } else {
      navigate('/camera/start');
    }


    
  };

  const handleSettingsClick = () => {
    navigate('/mypage');
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
            {isStoryLoading && <p>스토리를 불러오는 중...</p>}
            {isStoryError && <p>스토리 로드 중 오류가 발생했습니다.</p>}
            {myStoryInfo && (
              <StoryItemContainer key={`me-${myStoryInfo.id}`} onClick={() => handleStoryItemClick(0)}>
                <StoryImageContainer>
                  <StoryImage
                      src={myStoryInfo.profileImage || profileIcon}
                      alt="내 스토리"
                      statusColor={colors.gray}
                  />
                  {myStoryInfo.status === "NONE" && (
                    <PlusButton>
                      <PlusIcon>+</PlusIcon>
                    </PlusButton>
                  )}
                </StoryImageContainer>
                <StoryName>{'내 스토리'}</StoryName>
              </StoryItemContainer>
            )}
            {friendStoryInfos.map((friend, index) => {
              const userIndex = myStoryInfo ? index + 1 : index;
              if (friendStoryInfos.length === index + 1) {
                return (
                  <StoryItemContainer ref={lastStoryElementRef} key={friend.id} onClick={() => handleStoryItemClick(userIndex)}>
                    <StoryImage
                        src={friend.profileImage || profileIcon}
                        alt={friend.id.toString()}
                        statusColor={getStatusBorderColor(friend.status)}
                    />
                    <StoryName>{friend.userName || `친구${friend.id}`}</StoryName>
                  </StoryItemContainer>
                );
              } else {
                return (
                  <StoryItemContainer key={friend.id} onClick={() => handleStoryItemClick(userIndex)}>
                    <StoryImage
                        src={friend.profileImage || profileIcon}
                        alt={friend.id.toString()}
                        statusColor={getStatusBorderColor(friend.status)}
                    />
                    <StoryName>{friend.userName || `친구${friend.id}`}</StoryName>
                  </StoryItemContainer>
                );
              }
            })}
            {isFetchingNextStoryPage && <p>친구 스토리를 더 불러오는 중...</p>}
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
            {myTodosLoading && <p>내 할 일 목록을 불러오는 중...</p>}
            {myTodosError && <p>오류가 발생했습니다.</p>}
            {myTodosResponse?.result.totalElementCount === 0 && (
              <EmptyMessage>진행중인 할 일이 없습니다.</EmptyMessage>
            )}
            {myTodosResponse?.result.todos.map(renderMyTodoItem)}
          </TaskList>
        </Section>

        {/* 친구 할 일 섹션 */}
        <Section style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, marginBottom: 0 }}>
          <SectionTitle>친구</SectionTitle>
          <FriendTaskList onScroll={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && friendHasNext && !friendFetchingNext) {
              fetchNextFriend();
            }
          }}>
            {friendLoading && <p>친구 목록을 불러오는 중...</p>}
            {friendError && <p>오류가 발생했습니다.</p>}
            {flatFriendTodos.length === 0 && !friendLoading &&(
              <EmptyMessage>진행중인 할 일이 없습니다.</EmptyMessage>
            )}
            {flatFriendTodos.map(renderFriendTodoItem)}
            {friendFetchingNext && <p>더 불러오는 중...</p>}
          </FriendTaskList>
        </Section>
      </Content>

      {/* 우측 하단 고정 카메라 버튼 */}
      <CameraButton onClick={handleCameraClick}>
        <CameraIcon src={cameraIcon} alt="카메라" />
      </CameraButton>

      {/* 스토리 뷰어 컴포넌트 */}
      {showStoryViewer && (
        <StoryViewerOverlay>
          <StoryViewer
            users={allStoryUsers}
            initialUserIndex={selectedUserIndex}
            onClose={handleCloseStoryViewer}
          />
        </StoryViewerOverlay>
      )}

      {/* 진행중인 할일 존재 모달 */}
      {showInProgressModal && (
        <ModalOverlay>
          <ModalContainer>
            <ModalMessage>이미 진행중인 할 일이 존재합니다.</ModalMessage>
            <ModalCloseButton onClick={() => setShowInProgressModal(false)}>
              닫기
            </ModalCloseButton>
          </ModalContainer>
        </ModalOverlay>
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

const EmptyMessage = styled.p`
  color: #aaaaaa;
  text-align: center;
  padding: 20px;
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

const StoryImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StoryImage = styled.img<{ statusColor: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ statusColor }) => statusColor};
`;

const PlusButton = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background-color: #7c3aed;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
`;

const PlusIcon = styled.span`
  color: white;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
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
  z-index: 2000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 320px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalMessage = styled.p`
  text-align: center;
  font-size: 16px;
  color: #832CC5;
  font-weight: 500;
  margin-bottom: 24px;
`;

const ModalCloseButton = styled.button`
  background-color: #7c3aed;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #6d28d9;
  }
`;
