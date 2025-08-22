import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, RemoveIcon, AcceptIcon } from '@assets/icons';
import { css } from "@emotion/react";
import { useGetReceivedRequests, useGetSentRequests } from '../../hooks/api/friendship/useGetRequests';
import { useAcceptFriendRequest, useRejectFriendRequest, useCancelSentRequest } from '../../hooks/api/friendship/useFriendRequestActions';
import profileIcon from '../../assets/icons/home/profile.svg';

const FriendRequestContainer = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: ${colors.white};
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  width: 100%;
  height: 61px;
  background: linear-gradient(180deg, #f1e7f9 0%, #f1e7f9 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const HeaderTitle = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #1d1d1d;
  margin: 0;
  padding-top: 2px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  height: calc(100vh - 61px);
  margin-top: 0;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  height: 55px;
  background: #ffffff;
  border-bottom: 1px solid #F6F6F6;
`;

const Tab = styled.div<{ isActive: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: ${props => props.isActive ? '#832cc5' : '#bababa'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.isActive ? '#832cc5' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.isActive ? '#832cc5' : '#1d1d1d'};
  }
`;

const TabContent = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  flex-direction: column;
  gap: 30px;
  height: calc(100vh - 61px - 55px);
  padding: 10px 0;
  overflow-y: auto;
`;

const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 0;
  position: relative;
`;

const FriendItem = styled.div`
  width: 100%;
  height: 80px;
  border-top: 1px solid #F6F6F6;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  background: transparent;
  
  &:first-child {
    border-top: none;
  }
`;

const FriendCard = styled.div`
  width: 100%;
  height: 80px;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 30px;
  gap: 20px;
`;

const ProfileImage = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
`;

const FriendName = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #1d1d1d;
  flex: 1;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const NotificationBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 297px;
  height: 148px;
  background: #f1e7f9;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  z-index: 1000;
`;

const NotificationText = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #1d1d1d;
  margin: 0;
  text-align: center;
`;

const ConfirmButton = styled.button`
  width: 90px;
  height: 36px;
  background: #c8b0db;
  border: none;
  border-radius: 50px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
`;

const FriendRequest = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const { data: receivedRequests } = useGetReceivedRequests();
  const { data: sentRequests } = useGetSentRequests();
  const acceptMutation = useAcceptFriendRequest();
  const rejectMutation = useRejectFriendRequest();
  const cancelMutation = useCancelSentRequest();

  const apiReceivedRequests = receivedRequests?.result.friends ?? [];
  const apiSentRequests = sentRequests?.result.friends ?? [];

  const handleBack = () => {
    navigate(-1);
  };

  const handleAcceptRequest = (friendId: number) => {
    acceptMutation.mutate(friendId, {
      onSuccess: () => {
        console.log('친구 요청 수락 성공:', friendId);
      },
      onError: (error) => {
        console.error('친구 요청 수락 실패:', error);
      }
    });
  };

  const handleRejectRequest = (friendId: number) => {
    rejectMutation.mutate(friendId, {
      onSuccess: () => {
        console.log('친구 요청 거절 성공:', friendId);
      },
      onError: (error) => {
        console.error('친구 요청 거절 실패:', error);
      }
    });
  };

  const handleCancelSentRequest = (friendId: number) => {
    cancelMutation.mutate(friendId, {
      onSuccess: () => {
        console.log('보낸 친구 요청 취소 성공:', friendId);
        setShowNotification(true);
      },
      onError: (error) => {
        console.error('보낸 친구 요청 취소 실패:', error);
      }
    });
  };

  const handleConfirmNotification = () => {
    setShowNotification(false);
  };

  return (
    <FriendRequestContainer>
      <Header>
        <BackLightIcon
          css={css`
            width: 24px;
            height: 21px;
            cursor: pointer;
            margin-top: 2px;
          `}
          onClick={handleBack}
        />
        <HeaderContainer>
          <HeaderTitle>친구 요청</HeaderTitle>
        </HeaderContainer>
      </Header>

      <Content>
        <TabContainer>
          <Tab 
            isActive={activeTab === 'received'} 
            onClick={() => setActiveTab('received')}
          >
            받은 요청
          </Tab>
          <Tab 
            isActive={activeTab === 'sent'} 
            onClick={() => setActiveTab('sent')}
          >
            보낸 요청
          </Tab>
        </TabContainer>

        <TabContent isVisible={activeTab === 'received'}>
          <FriendList>
            {apiReceivedRequests.map((friend) => (
              <FriendItem key={friend.id}>
                <FriendCard>
                  <ProfileImage src={friend.image || profileIcon} alt={`${friend.nickname} 프로필`} />
                  <FriendName>{friend.nickname}</FriendName>
                  <ActionButtons>
                    <AcceptIcon 
                      css={css`
                        width: 24px;
                        height: 24px;
                        cursor: ${acceptMutation.isPending ? 'not-allowed' : 'pointer'};
                        opacity: ${acceptMutation.isPending ? 0.5 : 1};
                      `}
                      onClick={() => !acceptMutation.isPending && handleAcceptRequest(friend.id)}
                    />
                    <RemoveIcon 
                      css={css`
                        width: 24px;
                        height: 24px;
                        cursor: ${rejectMutation.isPending ? 'not-allowed' : 'pointer'};
                        opacity: ${rejectMutation.isPending ? 0.5 : 1};
                      `}
                      onClick={() => !rejectMutation.isPending && handleRejectRequest(friend.id)}
                    />
                  </ActionButtons>
                </FriendCard>
              </FriendItem>
            ))}
          </FriendList>
        </TabContent>

        <TabContent isVisible={activeTab === 'sent'}>
          <FriendList>
            {apiSentRequests.map((friend) => (
              <FriendItem key={friend.id}>
                <FriendCard>
                  <ProfileImage src={friend.image || profileIcon} alt={`${friend.nickname} 프로필`} />
                  <FriendName>{friend.nickname}</FriendName>
                  <RemoveIcon 
                    css={css`
                      width: 24px;
                      height: 24px;
                      cursor: ${cancelMutation.isPending ? 'not-allowed' : 'pointer'};
                      opacity: ${cancelMutation.isPending ? 0.5 : 1};
                    `}
                    onClick={() => !cancelMutation.isPending && handleCancelSentRequest(friend.id)}
                  />
                </FriendCard>
              </FriendItem>
            ))}
          </FriendList>
        </TabContent>
      </Content>

      {showNotification && (
        <NotificationBox>
          <NotificationText>재요청은 7일 후에 가능합니다.</NotificationText>
          <ConfirmButton onClick={handleConfirmNotification}>
            확인
          </ConfirmButton>
        </NotificationBox>
      )}
    </FriendRequestContainer>
  );
};

export default FriendRequest; 