import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, RemoveIcon, AcceptIcon } from '@assets/icons';
import profileIcon from '../../assets/icons/home/profile.svg';
import { css } from "@emotion/react";

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
  gap: 30px;
  height: calc(100vh - 61px - 55px);
  margin-top: 55px;
  overflow-y: auto;
  padding-bottom: 60px;
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
`;

const SectionTitle = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #1d1d1d;
  margin-left: 16px;
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
  
  const [receivedRequests, setReceivedRequests] = useState([
    { id: 1, name: '강연주', profile: profileIcon },
    { id: 2, name: '김수진', profile: profileIcon },
    { id: 3, name: '정소민', profile: profileIcon },
    { id: 4, name: '강연주', profile: profileIcon },
    { id: 5, name: '김수진', profile: profileIcon },
    { id: 6, name: '정소민', profile: profileIcon },
    { id: 7, name: '강연주', profile: profileIcon },
    { id: 8, name: '김수진', profile: profileIcon },
    { id: 9, name: '정소민', profile: profileIcon },
    { id: 10, name: '강연주', profile: profileIcon },
    { id: 11, name: '김수진', profile: profileIcon },
    { id: 12, name: '정소민', profile: profileIcon },
  ]);

  const [sentRequests, setSentRequests] = useState([
    { id: 4, name: '강연주', profile: profileIcon },
    { id: 5, name: '김수진', profile: profileIcon },
    { id: 6, name: '정소민', profile: profileIcon },
    { id: 7, name: '강연주', profile: profileIcon },
    { id: 8, name: '김수진', profile: profileIcon },
    { id: 9, name: '정소민', profile: profileIcon },
    { id: 10, name: '강연주', profile: profileIcon },
    { id: 11, name: '김수진', profile: profileIcon },
    { id: 12, name: '정소민', profile: profileIcon },
  ]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAcceptRequest = (friendId: number) => {
    // TODO: 친구 요청 수락 API 호출
    console.log('친구 요청 수락:', friendId);
    setReceivedRequests(receivedRequests.filter(friend => friend.id !== friendId));
  };

  const handleRejectRequest = (friendId: number) => {
    // TODO: 친구 요청 거절 API 호출
    console.log('친구 요청 거절:', friendId);
    setReceivedRequests(receivedRequests.filter(friend => friend.id !== friendId));
  };

  const handleCancelSentRequest = (friendId: number) => {
    // TODO: 보낸 친구 요청 취소 API 호출
    console.log('보낸 친구 요청 취소:', friendId);
    setSentRequests(sentRequests.filter(friend => friend.id !== friendId));
    setShowNotification(true);
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
        <div>
          <SectionTitle>받은 요청</SectionTitle>
          <FriendList>
            {receivedRequests.map((friend) => (
              <FriendItem key={friend.id}>
                <FriendCard>
                  <ProfileImage src={friend.profile} alt={`${friend.name} 프로필`} />
                  <FriendName>{friend.name}</FriendName>
                  <ActionButtons>
                    <AcceptIcon 
                      css={css`
                        width: 24px;
                        height: 24px;
                        cursor: pointer;
                      `}
                      onClick={() => handleAcceptRequest(friend.id)}
                    />
                    <RemoveIcon 
                      css={css`
                        width: 24px;
                        height: 24px;
                        cursor: pointer;
                      `}
                      onClick={() => handleRejectRequest(friend.id)}
                    />
                  </ActionButtons>
                </FriendCard>
              </FriendItem>
            ))}
          </FriendList>
        </div>

        <div>
          <SectionTitle>보낸 요청</SectionTitle>
          <FriendList>
            {sentRequests.map((friend) => (
              <FriendItem key={friend.id}>
                <FriendCard>
                  <ProfileImage src={friend.profile} alt={`${friend.name} 프로필`} />
                  <FriendName>{friend.name}</FriendName>
                  <RemoveIcon 
                    css={css`
                      width: 24px;
                      height: 24px;
                      cursor: pointer;
                    `}
                    onClick={() => handleCancelSentRequest(friend.id)}
                  />
                </FriendCard>
              </FriendItem>
            ))}
          </FriendList>
        </div>
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