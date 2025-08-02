import React, { useState } from 'react';
import { Col, Row } from '@components/common/flex/Flex';
import Header from '@components/common/header/Header';
import Txt from '@components/common/Txt';
import styled from '@emotion/styled';
import { colors } from '@styles/theme';

interface CreateTaskScreenProps {
  startImage?: string;
}

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ 
  startImage = '/src/assets/icons/default.png' 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetTime, setTargetTime] = useState(30);
  const [selectedTime, setSelectedTime] = useState('30');

  const timeOptions = [
    { value: '15', label: '15분' },
    { value: '30', label: '30분' },
    { value: '45', label: '45분' },
    { value: '60', label: '1시간' },
    { value: '90', label: '1시간 30분' },
    { value: '120', label: '2시간' },
  ];

  const handleTimeChange = (value: string) => {
    setSelectedTime(value);
    setTargetTime(parseInt(value));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!description.trim()) {
      alert('설명을 입력해주세요.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      userId: 'user1',
      title: title.trim(),
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
    // 여기서 API 호출 또는 상태 업데이트
  };

  return (
    <Container>
      <Header
        isBack={true}
        isRight={false}
        title="할 일 만들기"
      />
      <Content>
        {/* 시작 사진 */}
        <ImageSection>
          <StartImage src={startImage} alt="start" />
          <Txt fontSize="14px" color={colors.textGray}>
            시작 사진
          </Txt>
        </ImageSection>

        {/* 제목 입력 */}
        <InputSection>
          <Label>제목</Label>
          <Input
            type="text"
            placeholder="할 일의 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
          />
          <CharacterCount>{title.length}/50</CharacterCount>
        </InputSection>

        {/* 설명 입력 */}
        <InputSection>
          <Label>설명</Label>
          <TextArea
            placeholder="할 일에 대한 설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            rows={4}
          />
          <CharacterCount>{description.length}/200</CharacterCount>
        </InputSection>

        {/* 목표 시간 선택 */}
        <InputSection>
          <Label>목표 시간</Label>
          <TimeOptionsContainer>
            {timeOptions.map((option) => (
              <TimeOption
                key={option.value}
                isSelected={selectedTime === option.value}
                onClick={() => handleTimeChange(option.value)}
              >
                {option.label}
              </TimeOption>
            ))}
          </TimeOptionsContainer>
        </InputSection>

        {/* 제출 버튼 */}
        <SubmitButton 
          onClick={handleSubmit}
          disabled={!title.trim() || !description.trim()}
        >
          할 일 시작하기
        </SubmitButton>
      </Content>
    </Container>
  );
};

export default CreateTaskScreen;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${colors.white};
`;

const Content = styled.div`
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
`;

const StartImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid ${colors.purple1};
`;

const InputSection = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: ${colors.textBlack};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${colors.purple1};
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${colors.purple3};
  }
  
  &::placeholder {
    color: ${colors.textGray};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${colors.purple1};
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${colors.purple3};
  }
  
  &::placeholder {
    color: ${colors.textGray};
  }
`;

const CharacterCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: ${colors.textGray};
  margin-top: 4px;
`;

const TimeOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const TimeOption = styled.button<{ isSelected: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${({ isSelected }) => 
    isSelected ? colors.purple3 : colors.purple1};
  border-radius: 8px;
  background-color: ${({ isSelected }) => 
    isSelected ? colors.purple3 : 'white'};
  color: ${({ isSelected }) => 
    isSelected ? colors.white : colors.textBlack};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.purple3};
    background-color: ${({ isSelected }) => 
      isSelected ? colors.purple3 : colors.purple1};
  }
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  background-color: ${({ disabled }) => 
    disabled ? colors.textGray : colors.purple3};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  margin-top: 20px;
  
  &:hover {
    opacity: ${({ disabled }) => disabled ? 1 : 0.9};
  }
`; 