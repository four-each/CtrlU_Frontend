import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, AddFriendIcon, SearchIcon, AlarmLightIcon } from '@assets/icons';
import { css } from "@emotion/react";

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

const AddFriend = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // 임시 친구 데이터
  const friends = [
    { id: 1, name: '강연주', profile: '/assets/default-profile.jpg' },
    { id: 2, name: '김수진', profile: '/assets/default-profile.jpg' },
    { id: 3, name: '정소민', profile: '/assets/default-profile.jpg' },
    { id: 4, name: '송채영', profile: '/assets/default-profile.jpg' },
    { id: 5, name: '김수진', profile: '/assets/default-profile.jpg' },
    { id: 6, name: '김수진', profile: '/assets/default-profile.jpg' },
    { id: 7, name: '김수진', profile: '/assets/default-profile.jpg' },
    { id: 8, name: '김수진', profile: '/assets/default-profile.jpg' },
    { id: 9, name: '김수진', profile: '/assets/default-profile.jpg' },
    { id: 10, name: '김수진', profile: '/assets/default-profile.jpg' },
    { id: 11, name: '김수진', profile: '/assets/default-profile.jpg' },
    { id: 12, name: '김수진', profile: '/assets/default-profile.jpg' },
  ];

  // 동적으로 친구 수 계산
  const totalFriends = friends.length;
  const maxFriends = 20; // 최대 친구 수

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddFriend = (friendId: number) => {
    // TODO: 친구 추가 API 호출
    console.log('친구 추가:', friendId);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
          {friends.map((friend) => (
            <FriendItem key={friend.id}>
              <FriendCard>
                <ProfileImage src={friend.profile} alt={`${friend.name} 프로필`} />
                <FriendName>{friend.name}</FriendName>
                <AddFriendIcon 
                  onClick={() => handleAddFriend(friend.id)}
                  css={css`
                    width: 24px;
                    height: 24px;
                    margin-top: 2px;
                  `}
                />
              </FriendCard>
            </FriendItem>
          ))}
        </FriendList>
      </Content>
    </AddFriendContainer>
  );
};

export default AddFriend; 