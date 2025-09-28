import React, { useState } from 'react';
import { Col, Row } from '@components/common/flex/Flex';
import Header from '@components/common/header/Header';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { colors } from '@styles/theme';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import backArrowWhiteIcon from '../../assets/icons/detail/backArrow_white.svg';
import profileIcon from '../../assets/icons/home/profile.svg';
import { useCreateTodo } from '../../hooks/api/todo/useCreateTodo';
import { useAuthenticatedPresignUpload } from '../../hooks/api/common/useAuthenticatedPresignUpload';
import { postUploadToS3 } from '../../utils/s3';

interface CreateTaskScreenProps {
  startImage?: string;
}

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ 
  startImage: propStartImage = '/src/assets/icons/default.png' 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const startImage = location.state?.startImage || propStartImage;
  const [description, setDescription] = useState(location.state?.description || '');
  const [selectedHours, setSelectedHours] = useState(location.state?.selectedHours || 0);
  const [selectedMinutes, setSelectedMinutes] = useState(location.state?.selectedMinutes || 0);

  const createTodoMutation = useCreateTodo();
  const presignMutation = useAuthenticatedPresignUpload();

  const handleTimeChange = (hours: number, minutes: number) => {
    setSelectedHours(hours);
    setSelectedMinutes(minutes);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const targetTime = selectedHours * 60 + selectedMinutes;
    if (targetTime === 0) {
      alert('시간을 설정해주세요.');
      return;
    }

    try {
      let startImageKey: string | undefined = undefined;

      if (startImage && !startImage.includes('default.png') && startImage.startsWith('data:image')) {
        const byteCharacters = atob(startImage.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        const file = new File([blob], 'start-image.jpg', { type: 'image/jpeg' });

        const fileExtension = 'jpg';
        const imageType = "START_IMAGE";
        const contentType = file.type;
        
        const presignResponse = await presignMutation.mutateAsync({ 
          imageType, 
          fileExtension: `.${fileExtension}`, 
          contentType 
        });

        if (!presignResponse?.result?.presignedUrl) {
          console.log('Failed to get presigned URL from server.');
          return;
        }

        const { presignedUrl, imageKey } = presignResponse.result;
        await postUploadToS3(presignedUrl, imageKey, file, contentType);
        startImageKey = imageKey;
      }

      const challengeTime = `${selectedHours.toString().padStart(2, '0')}:${selectedMinutes.toString().padStart(2, '0')}:00`;

      const payload = {
        title: description.trim(),
        challengeTime,
        startImageKey: startImageKey || '',
      };

      console.log('[CreateTask] 할일 생성 요청 페이로드:', payload);

      const result = await createTodoMutation.mutateAsync(payload);

      if (result.status === 200) {
        console.log('할일 생성 성공');
        navigate('/');
      }
    } catch (error) {
      console.error('할일 생성 실패:', error);
      alert('할일 생성에 실패했습니다.');
    }
  };

  const formatGoalTime = () => {
    return `${selectedHours.toString().padStart(2, '0')}:${selectedMinutes.toString().padStart(2, '0')}:00`;
  };

  return (
    <Container>

      <HeaderSection>
        <BackButton onClick={() => window.history.back()}>
          <BackIcon src={backArrowWhiteIcon} alt="뒤로가기" />
        </BackButton>
        <HeaderTitle>시작</HeaderTitle>
      </HeaderSection>

      <ActivityCard>
        <ActivityIcon src={profileIcon} alt="Activity" />
        <ActivityName>{description}</ActivityName>
      </ActivityCard>

      <CircularProgressSection>
        <Col
          css={css`
            max-width: 300px;
          `}
        >
          <CircularProgressbarWithChildren
            value={0}
            strokeWidth={7}
            styles={{
              path: {
                stroke: "url(#gradient)",
                strokeLinecap: "round",
              },
              trail: {
                stroke: "#d4d4d8",
              },
            }}
            css={css`
              box-shadow: 0px 0px 10px 2px rgba(131, 44, 197, 0.6);
              border-radius: 50%;
            `}
          >
            <img
              css={css`
                width: 84%;
                height: 84%;
                margin-top: -9px;
                border-radius: 50%;
                object-fit: cover;
              `}
              src={startImage}
              alt="촬영된 사진"
            />
            <Percent>0%</Percent>
          </CircularProgressbarWithChildren>
          <svg width="0" height="0">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="10%" y2="100%">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="#832CC5" />
              </linearGradient>
            </defs>
          </svg>
        </Col>
      </CircularProgressSection>

      <GoalTimeSection>
        <GoalTimeLabel>목표 시간</GoalTimeLabel>
        <GoalTime>{formatGoalTime()}</GoalTime>
      </GoalTimeSection>

      <StartButtonSection>
        <StartButton 
          onClick={handleSubmit}
          disabled={createTodoMutation.isPending || presignMutation.isPending}
        >
          {createTodoMutation.isPending || presignMutation.isPending ? '처리중...' : '시작'}
        </StartButton>
      </StartButtonSection>
    </Container>
  );
};

export default CreateTaskScreen;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background-color: white;
  min-height: 100vh;
`;

const HeaderSection = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  background-color: #ad8aca;
  font-size: 18px;
  font-weight: 500;
  color: white;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  display: flex;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`;

const BackIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

const HeaderTitle = styled.h1`
  color: white;
  font-size: 18px;
  font-weight: 500;
  font-family: 'Noto Sans KR', sans-serif;
  margin: 0;
`;

const ActivityCard = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 56px;
  width: calc(233 / 375 * 100vw);
  max-width: 233px;
`;

const ActivityIcon = styled.img`
  width: 35px;
  height: 35px;
  object-fit: contain;
  margin-bottom: 14px;
  border: 2px solid #c8b0db;
  border-radius: 50%;
`;

const ActivityName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 40px;
  width: calc(233 / 375 * 100vw);
  max-width: 233px;
  background-color: #f5f5f5;
  border-radius: 50px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  color: #57534e;
  font-size: 16px;
  text-align: center;
  font-weight: 500;
`;

const CircularProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  width: 100%;
`;

const Percent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 30px;
  height: 30px;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  background-color: #832CC5;
  border-radius: 50%;
  z-index: 1;
  
  top: 3%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const GoalTimeSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;

const GoalTimeLabel = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #AD8ACA;
  margin: 0;
`;

const GoalTime = styled.time`
  margin-top: 4px;
  font-size: 60px;
  font-weight: 500;
  color: #292524;
`;

const StartButtonSection = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
  margin-top: 20px;
  margin-bottom: 64px;
`;

const StartButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px 64px;
  width: 100%;
  max-width: 335px;
  background-color: #832CC5;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #6d28d9;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.3);
  }
`;
