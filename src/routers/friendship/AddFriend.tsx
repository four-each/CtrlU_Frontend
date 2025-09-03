import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, AddFriendIcon, SearchIcon } from '@assets/icons';
import profileIcon from '../../assets/icons/home/profile.svg';
import { css } from "@emotion/react";
import { useSearchFriends } from '../../hooks/api/friendship/useSearchFriends';
import { useFriendRequest } from '../../hooks/api/friendship/useFriendRequestActions';
import { getUserId } from '../../utils/auth';

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

const LimitModal = styled.div`
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
  gap: 18px;
  z-index: 1000;
`;

const LimitModalText = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #1d1d1d;
  margin: 0;
  text-align: center;
  white-space: pre-line;
`;

const LimitModalButton = styled.button`
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

const AddFriend = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const effectiveQuery = searchQuery.length >= 2 ? searchQuery : '';
  const { data: searchResults, isLoading, error } = useSearchFriends(effectiveQuery);
  const addFriendMutation = useFriendRequest()

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // 검색 결과가 있으면 API 데이터 사용, 없으면 빈 배열
  const friends = searchResults?.result.values ?? [];
  const hasNext = searchResults?.result.hasNext ?? false;
  const nextCursorId = searchResults?.result.nextCursorId;

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddFriend = async (targetId: number, nickname: string) => {
    try {
      const result = await addFriendMutation.mutateAsync({
        targetId
      });
      if (result.status === 200) {
        setModalMessage(`${nickname}님에게 친구 요청을 보냈습니다.`);
        setShowLimitModal(true);
        // 보낸 요청 목록을 최신화하여 요청 화면 진입 시 바로 반영되도록 처리
        queryClient.invalidateQueries({ queryKey: ["friendship", "sent-requests"] });
        queryClient.refetchQueries({ queryKey: ["friendship", "sent-requests"] });
      } 
    } catch (e) {
      const code = e instanceof Error ? e.message : String(e);

      // 대기중인 요청이 존재하는 친구
      if (code === "F004") {
        setModalMessage('이미 대기중인 친구 요청이 있어요.');
        setShowLimitModal(true);
        return;
      }

      // 이미 친구인 경우
      if (code === "F005") {
        setModalMessage('이미 친구인 사용자예요.');
        setShowLimitModal(true);
        return;
      }

      // 내가 요청을 거절한지 7일이 지나지 않은 경우
      if (code === "F006") {
        setModalMessage('최근에 이 사용자가 요청을 거절했어요.\n7일 뒤에 재요청해주세요.');
        setShowLimitModal(true);
        return;
      }

      // 최대 친구 수 초과
      if (code === "F007") {
        setModalMessage('최대 친구 수를 초과했습니다.\n더 이상 추가할 수 없어요.');
        setShowLimitModal(true);
        return;
      }

      setModalMessage('친구 요청에 실패했습니다.\n다시 시도해주세요.');
      setShowLimitModal(true);
    }
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
        </HeaderContainer>
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
              placeholder="이메일로 검색하기 ⭐️"
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
            />
          </SearchInput>
        </SearchSection>

        <FriendList>
          {searchQuery.length > 0 && searchQuery.length < 2 ? (
            <EmptyState>2자 이상 입력해주세요! 😄</EmptyState>
          ) : isLoading ? (
            <EmptyState>검색 중...</EmptyState>
          ) : error ? (
            <EmptyState>검색 중 오류가 발생했습니다.</EmptyState>
          ) : friends.length === 0 ? (
            searchQuery ? (
              <EmptyState>검색 결과가 없습니다.</EmptyState>
            ) : (
              <EmptyState>친구를 검색해보세요! 😄</EmptyState>
            )
          ) : (
            friends.map((friend) => (
              <FriendItem key={friend.id}>
                <FriendCard>
                  <ProfileImage src={friend.image || profileIcon} alt={`${friend.nickname} 프로필`} />
                  <FriendName>{friend.nickname}</FriendName>
                  {!(friend.id === getUserId()) && (
                    <AddFriendIcon 
                      onClick={() => handleAddFriend(friend.id, friend.nickname)}
                      css={css`
                        width: 24px;
                        height: 24px;
                        margin-top: 2px;
                        cursor: pointer;
                      `}
                    />
                  )}
                </FriendCard>
              </FriendItem>
            ))
          )}
        </FriendList>
      </Content>

      {showLimitModal && (
        <LimitModal>
          <LimitModalText>{modalMessage}</LimitModalText>
          <LimitModalButton onClick={() => setShowLimitModal(false)}>확인</LimitModalButton>
        </LimitModal>
      )}
    </AddFriendContainer>
  );
};

export default AddFriend; 