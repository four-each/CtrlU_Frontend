import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';
import { BackLightIcon, ArchiveIcon, FriendListIcon, FriendRequestIcon, SettingIcon } from '@assets/icons';
import profileIcon from '../../assets/icons/home/profile.svg';
import { css } from "@emotion/react";

const MyPageContainer = styled.div`
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

const HeaderTitle = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 18px;
  height: 22px;
  color: #1d1d1d;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 2px;
`;

const Content = styled.div`
  padding: 40px 20px 0px 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ProfileSection = styled.div`
  width: 100%;
  height: 110px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #c8b0db;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
`;

const ProfileImage = styled.img`
  width: 66px;
  height: 66px;
  border-radius: 50%;
  border: 2px solid #c8b0db;
  object-fit: cover;
  margin-left: 20px;
  margin-top: 20px;
`;

const ProfileInfo = styled.div`
  margin-top: 30px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProfileName = styled.h2`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #1d1d1d;
  margin: 0;
`;

const ProfileStatus = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #ad8aca;
  margin: 0;
`;

const FriendsSection = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
`;

const FriendTab = styled.div`
  width: 105px;
  height: 90px;
  background: #f6f6f6;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #e8e8e8;
  }
`;

const FriendText = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #ad8aca;
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 7px;
`;

const SettingsTitle = styled.h3`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  height: 19px;
  font-size: 16px;
  color: #1d1d1d;
  margin: 0px;
  padding-top: 2px;
`;

const SettingsDivider = styled.div`
  width: 100%;
  height: 15px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(219, 229, 229, 0.3) 100%);
  border-radius: 8px;
  margin-bottom: 4px;
`;

const SettingsItem = styled.div`
  width: 100%;
  height: 50px;
  background: #f4f4f4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 26px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 12px;
  
  &:hover {
    background: #e8e8e8;
  }
`;

const SettingsText = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #1d1d1d;
`;

const MyPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate('/mypage/edit');
  };

  const handleFriendList = () => {
    // TODO: 친구 목록 페이지로 이동
    console.log('친구 목록');
    navigate('/friendship/list');
  };

  const handleFriendRequest = () => {
    // TODO: 친구 요청 페이지로 이동
    console.log('친구 요청');
    navigate('/friendship/request');
  };

  const handleArchive = () => {
    // TODO: 보관함 페이지로 이동
    console.log('보관함');
  };

  const handlePasswordChange = () => {
    // TODO: 비밀번호 변경 페이지로 이동
    console.log('비밀번호 변경');
    navigate('/mypage/password-reset');
  };

  const handlePrivacy = () => {
    // TODO: 개인정보 처리방침 페이지로 이동
    console.log('개인정보 처리방침');
  };

  const handleLogout = () => {
    // TODO: 로그아웃 로직
    console.log('로그아웃');
    navigate('/auth/login');
  };

  const handleWithdraw = () => {
    // TODO: 계정 탈퇴 로직
    console.log('계정 탈퇴');
  };

  return (
    <MyPageContainer>
      <Header>
        <BackLightIcon 
          css={css`
            width: 24px;
            height: 21px;
            cursor: pointer;
            margin-top: 2px;
          `}
          onClick={handleBack} />
        <HeaderTitle>마이페이지</HeaderTitle>
      </Header>

      <Content>
        <ProfileSection>
          <ProfileImage src={profileIcon} alt="프로필 이미지" />
          <ProfileInfo>
            <ProfileName>ㅇㅇ 님</ProfileName>
            <ProfileStatus>오늘의 목표는? 🔥</ProfileStatus>
          </ProfileInfo>
          <SettingIcon 
            css={css`
              width: 24px;
              height: 24px;
              cursor: pointer;
              margin-right: 16px;
              margin-top: 16px;
            `}
            onClick={handleEdit} />
        </ProfileSection>

        <FriendsSection>
          <FriendTab onClick={handleFriendList}>
            <FriendListIcon />
            <FriendText>친구 목록</FriendText>
          </FriendTab>
          <FriendTab onClick={handleFriendRequest}>
            <FriendRequestIcon />
            <FriendText>친구 요청</FriendText>
          </FriendTab>
          <FriendTab onClick={handleArchive}>
            <ArchiveIcon />
            <FriendText>보관함</FriendText>
          </FriendTab>
        </FriendsSection>

        <SettingsSection>
          <SettingsTitle>이용 안내</SettingsTitle>
          <SettingsDivider />
          <SettingsItem onClick={handlePrivacy}>
            <SettingsText>개인정보 처리방침</SettingsText>
          </SettingsItem>
          <SettingsItem onClick={handlePasswordChange}>
            <SettingsText>비밀번호 변경</SettingsText>
          </SettingsItem>
          <SettingsItem onClick={handleLogout}>
            <SettingsText>로그아웃</SettingsText>
          </SettingsItem>
          <SettingsItem onClick={handleWithdraw}>
            <SettingsText>계정 탈퇴</SettingsText>
          </SettingsItem>
        </SettingsSection>
      </Content>
    </MyPageContainer>
  );
};

export default MyPage; 