import React, { useState } from 'react';
import { Col, Row } from '@components/common/flex/Flex';
import Header from '@components/common/header/Header';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { colors } from '@styles/theme';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

interface CreateTaskScreenProps {
  startImage?: string;
}

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ 
  startImage: propStartImage = '/src/assets/icons/default.png' 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(30);

  // location.state에서 전달받은 이미지 사용, 없으면 prop 사용
  const startImage = location.state?.startImage || propStartImage;

  const hours = Array.from({ length: 5 }, (_, i) => i); // 0-4시간
  const minutes = [0, 15, 30, 45];

  const handleTimeChange = (hours: number, minutes: number) => {
    setSelectedHours(hours);
    setSelectedMinutes(minutes);
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const targetTime = selectedHours * 60 + selectedMinutes;
    if (targetTime === 0) {
      alert('시간을 설정해주세요.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      userId: 'user1',
      title: description.trim(),
      description: description.trim(),
      targetTime,
      startTime: new Date(),
      startImage,
      isCompleted: false,
      isAbandoned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('새 할 일 생성:', newTask);
    navigate('/');
  };

  const formatGoalTime = () => {
    const totalMinutes = selectedHours * 60 + selectedMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };

  return (
    <Container>

      {/* Header */}
      <HeaderSection>
        <BackButton onClick={() => window.history.back()}>
          <BackIcon src="/assets/back.png" alt="뒤로가기" />
        </BackButton>
        <HeaderTitle>시작</HeaderTitle>
      </HeaderSection>

      {/* Activity Card */}
      <ActivityCard>
        <ActivityIcon src="/src/assets/icons/default.png" alt="Activity" />
        <ActivityNameInput
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          placeholder="활동명을 입력하세요"
        />
      </ActivityCard>

      {/* Circular Progress with Image */}
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
          {/* 그라데이션 정의 */}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="10%" y2="100%">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
        </Col>
      </CircularProgressSection>

      {/* Goal Time Display with Time Picker */}
      <GoalTimeSection>
        <GoalTimeLabel>목표 시간</GoalTimeLabel>
        <TimePickerRow>
          <TimeSelect 
            value={selectedHours} 
            onChange={(e) => handleTimeChange(parseInt(e.target.value), selectedMinutes)}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={i}>{i}시간</option>
            ))}
          </TimeSelect>
          <TimeSelect 
            value={selectedMinutes} 
            onChange={(e) => handleTimeChange(selectedHours, parseInt(e.target.value))}
          >
            <option value={0}>0분</option>
            <option value={15}>15분</option>
            <option value={30}>30분</option>
            <option value={45}>45분</option>
          </TimeSelect>
        </TimePickerRow>
        <GoalTime>{formatGoalTime()}</GoalTime>
      </GoalTimeSection>

      {/* Start Button */}
      <StartButtonSection>
        <StartButton onClick={handleSubmit}>
          시작
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

const StatusBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 16px 12px 32px;
  background-color: #94a3b8;
  backdrop-filter: blur(20px);
`;

const StatusTime = styled.time`
  font-size: 16px;
  font-weight: 600;
  color: black;
`;

const StatusIcons = styled.div`
  display: flex;
  gap: 1px;
  align-items: center;
`;

const StatusIcon = styled.img`
  width: 17px;
  height: auto;
  object-fit: contain;
`;

const HeaderSection = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
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
  padding: 4px;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`;

const BackIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`;

const ActivityCard = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 56px;
`;

const ActivityIcon = styled.img`
  width: 35px;
  height: 35px;
  object-fit: contain;
  margin-bottom: 14px;
`;

const ActivityNameInput = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 64px;
  max-width: 233px;
  background-color: #f5f5f5;
  border-radius: 50px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  color: #57534e;
  font-size: 16px;
  text-align: center;
  border: none;
  outline: none;
  
  &::placeholder {
    color: #a8a29e;
  }
  
  &:focus {
    box-shadow: 0px 0px 4px rgba(124, 58, 237, 0.3);
  }
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
  background-color: #7c3aed;
  border-radius: 50%;
  z-index: 1;
  
  /* 원형 진행바의 시작점(12시 방향)에 위치 */
  top: 0;
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
  color: #94a3b8;
  margin: 0;
`;

const TimePickerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const TimeSelect = styled.select`
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
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
  margin-top: 48px;
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
  background-color: #7c3aed;
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