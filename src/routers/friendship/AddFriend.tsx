import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, AddFriendIcon, SearchIcon, AlarmLightIcon } from '@assets/icons';
import profileIcon from '../../assets/icons/home/profile.svg';
import { css } from "@emotion/react";
import { useSearchFriends } from '../../hooks/api/friendship/useSearchFriends';

const AddFriendContainer = styled.div`
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
  height: calc(100vh - 61px);
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

const SearchIconContainer = styled.div`
  position: absolute;
  left: 10%;
  transform: translateX(-50%);
  z-index: 2;
`;

const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 0;
  height: 600px;
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

const AddFriend = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading, error } = useSearchFriends(searchQuery);

  // 검색 결과가 있으면 API 데이터 사용, 없으면 빈 배열
  const friends = searchResults?.result.values ?? [];
  const hasNext = searchResults?.result.hasNext ?? false;
  const nextCursorId = searchResults?.result.nextCursorId;

  // 동적으로 친구 수 계산
  const totalFriends = friends.length;
  const maxFriends = 20; // 최대 친구 수

  const handleBack = () => {
    navigate(-1);
  };

  const handleAlarm = () => {
    navigate('/friendship/request');
  };

  const handleAddFriend = (friendId: number) => {
    // TODO: 친구 추가 API 호출
    console.log('친구 추가:', friendId);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Enter 키로 검색 실행
      e.preventDefault();
    }
  };

  return (
    <AddFriendContainer>
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
            <SearchIconContainer>
              <SearchIcon 
                css={css`
                  width: 24px;
                  height: 24px;
                `}
              />
            </SearchIconContainer>
            <SearchInputField
              type="text"
              placeholder="친구 검색하기 💬"
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
            />
          </SearchInput>
        </SearchSection>

        <FriendList>
          {isLoading ? (
            <EmptyState>검색 중...</EmptyState>
          ) : error ? (
            <EmptyState>검색 중 오류가 발생했습니다.</EmptyState>
          ) : friends.length === 0 ? (
            searchQuery ? (
              <EmptyState>검색 결과가 없습니다.</EmptyState>
            ) : (
              <EmptyState>친구를 검색해보세요!</EmptyState>
            )
          ) : (
            friends.map((friend) => (
              <FriendItem key={friend.id}>
                <FriendCard>
                  <ProfileImage 
                    src={friend.image || profileIcon} 
                    alt={`${friend.nickname} 프로필`} 
                  />
                  <FriendName>{friend.nickname}</FriendName>
                  <AddFriendIcon 
                    onClick={() => handleAddFriend(friend.id)}
                    css={css`
                      width: 24px;
                      height: 24px;
                      margin-top: 2px;
                      cursor: pointer;
                    `}
                  />
                </FriendCard>
              </FriendItem>
            ))
          )}
        </FriendList>
      </Content>
    </AddFriendContainer>
  );
};

export default AddFriend; 