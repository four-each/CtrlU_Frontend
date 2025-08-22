import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, SearchIcon, AlarmLightIcon, RemoveIcon } from '@assets/icons';
import profileIcon from '../../assets/icons/home/profile.svg';
import { css } from "@emotion/react";
import { useGetFriends } from '../../hooks/api/friendship/useGetFriends';
import { useDeleteFriend } from '../../hooks/api/friendship/useFriendRequestActions';

const FriendListContainer = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: ${colors.white};
  margin: 0 auto;
  position: relative;
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

const HeaderCount = styled.span`
  font-family: 'Noto Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #545656;
  margin-left: 8px;
  padding-top: 2px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchSection = styled.div`
  width: 100%;
  height: 145px;
  background: #f6f6f6;
  border-top: 1px solid #AD8ACA;
  border-bottom: 1px solid #BABABA;
  border-radius: 0;
  padding: 45px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1;
`;

const SearchInput = styled.div`
  width: 100%;
  max-width: 315px;
  height: 50px;
  background: #ffffff;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  margin: 0 auto;
  gap: 10px;
  position: relative;
`;

const SearchPlaceholder = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #c8b0db;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 0;
  height: calc(100vh - 61px - 145px - 60px - 40px);
  overflow-y: auto;
  position: relative;
  padding-bottom: 50px;
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
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

const AddFriendButton = styled.button`
  width: 252px;
  height: 56px;
  background: #832cc5;
  border: none;
  border-radius: 50px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
  display: block;
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
`;

const FriendListPage = () => {
  const navigate = useNavigate();
  const { data: friendsData, isLoading, error } = useGetFriends();
  const deleteFriendMutation = useDeleteFriend();

  // 동적으로 친구 수 계산 (API 데이터 우선)
  const apiFriends = friendsData?.result.friends ?? [];
  const totalFriends = apiFriends.length;
  const maxFriends = 20; // 최대 친구 수

  const handleBack = () => {
    navigate(-1);
  };

  const handleAlarm = () => {
    navigate('/friendship/request');
  };

  const handleRemoveFriend = (friendId: number) => {
    deleteFriendMutation.mutate(friendId, {
      onSuccess: () => {
        console.log('친구 삭제 성공:', friendId);
      },
      onError: (error) => {
        console.error('친구 삭제 실패:', error);
      }
    });
  };

  const handleAddFriend = () => {
    navigate('/friendship/add');
  };

  return (
    <FriendListContainer>
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
          <HeaderTitle>친구 추가</HeaderTitle>
          <HeaderCount>({totalFriends}/{maxFriends})</HeaderCount>
        </HeaderContainer>
        <AlarmLightIcon
          css={css`
            width: 24px;
            height: 24px;
            cursor: pointer;
          `}  
          onClick={handleAlarm}
        />
      </Header>

      <Content>
        <SearchSection>
          <SearchInput>
            <SearchIcon 
              css={css`
                width: 24px;
                height: 24px;
                position: absolute;
                left: 10%;
                transform: translateX(-50%);
              `}
            />
            <SearchPlaceholder>친구 검색하기 💬</SearchPlaceholder>
          </SearchInput>
        </SearchSection>

        <FriendList>
          {apiFriends.map((friend) => (
            <FriendItem key={friend.id}>
              <FriendCard>
                <ProfileImage src={friend.image || profileIcon} alt={`${friend.nickname} 프로필`} />
                <FriendName>{friend.nickname}</FriendName>
                <RemoveIcon 
                  onClick={() => !deleteFriendMutation.isPending && handleRemoveFriend(friend.id)}
                  css={css`
                    width: 24px;
                    height: 24px;
                    cursor: ${deleteFriendMutation.isPending ? 'not-allowed' : 'pointer'};
                    opacity: ${deleteFriendMutation.isPending ? 0.5 : 1};
                  `}
                />
              </FriendCard>
            </FriendItem>
          ))}
        </FriendList>

        <AddFriendButton onClick={handleAddFriend}>
          + 친구 추가
        </AddFriendButton>
      </Content>
    </FriendListContainer>
  );
};

export default FriendListPage; 