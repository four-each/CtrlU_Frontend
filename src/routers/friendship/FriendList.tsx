import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, SearchIcon, AlarmLightIcon, AlarmActiveLightIcon, RemoveIcon, ArchiveOwl, BrushIcon } from '@assets/icons';
import profileIcon from '../../assets/icons/home/profile.svg';
import { css } from "@emotion/react";
import { useGetFriends } from '../../hooks/api/friendship/useGetFriends';
import { useGetReceivedRequests } from '../../hooks/api/friendship/useGetRequests';
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

const SearchInputField = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  color: #1d1d1d;
  text-align: center;
  
  &::placeholder {
    color: #c8b0db;
  }
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #bababa;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
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

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  gap: 50px;
`;

const AddFriendMent = styled.div`
  width: 263px;
  height: 57px;
  border-radius: 20px;
  border: 1px dashed #C8B0DB; 
  color: #C8B0DB;
  font-family: "Noto Sans KR";
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FriendListPage = () => {
  const navigate = useNavigate();
  const { data: friendsData, isLoading, error } = useGetFriends();
  const { data: receivedRequests } = useGetReceivedRequests();
  const deleteFriendMutation = useDeleteFriend();
  const [searchQuery, setSearchQuery] = useState('');

  // 동적으로 친구 수 계산 (API 데이터 우선)
  const apiFriends = friendsData?.result.friends ?? [];
  const totalFriends = apiFriends.length;
  const maxFriends = 20; // 최대 친구 수
  const hasPendingRequests = (receivedRequests?.result.friends ?? []).length > 0;

  const effectiveQuery = searchQuery.length >= 2 ? searchQuery : '';
  const filteredFriends = useMemo(() => {
    if (!effectiveQuery) return apiFriends;
    const q = effectiveQuery.toLowerCase();
    return apiFriends.filter((f: any) => String(f.nickname || '').toLowerCase().includes(q));
  }, [apiFriends, effectiveQuery]);

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
    navigate('/friendship/add', { state: { totalFriends, maxFriends } });
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
          <HeaderTitle>친구 목록</HeaderTitle>
          <HeaderCount>({totalFriends}/{maxFriends})</HeaderCount>
        </HeaderContainer>
        {hasPendingRequests ? (
          <AlarmActiveLightIcon
            css={css`
              width: 24px;
              height: 24px;
              cursor: pointer;
            `}
            onClick={handleAlarm}
          />
        ) : (
          <AlarmLightIcon
            css={css`
              width: 24px;
              height: 24px;
              cursor: pointer;
            `}  
            onClick={handleAlarm}
          />
        )}
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
            <SearchInputField
              type="text"
              placeholder="친구 이름으로 검색하기 💬"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInput>
        </SearchSection>

        <FriendList>
          {searchQuery.length > 0 && searchQuery.length < 2 ? (
            <EmptyState>2자 이상 입력해주세요!</EmptyState>
          ) : isLoading ? (
            <EmptyState>불러오는 중...</EmptyState>
          ) : error ? (
            <EmptyState>검색 중 오류가 발생했습니다.</EmptyState>
          ) : filteredFriends.length === 0 ? (
            effectiveQuery
              ? (
                <EmptyState>검색 결과가 없습니다.</EmptyState>
              )
              : (
                apiFriends.length === 0
                  ? <EmptyContainer>
                      <AddFriendMent>
                        친구를 추가해보세요.
                      </AddFriendMent>
                      <ArchiveOwl 
                        css={css`
                          width: 183px;
                          height: 169px;
                        `}
                      />
                  </EmptyContainer>
                  : <EmptyState>검색 결과가 없습니다.</EmptyState>
              )
          ) : (
            filteredFriends.map((friend: any) => (
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
            ))
          )}
        </FriendList>

        <AddFriendButton onClick={handleAddFriend}>
          + 친구 추가
        </AddFriendButton>
      </Content>
    </FriendListContainer>
  );
};

export default FriendListPage; 