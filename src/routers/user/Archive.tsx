import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { BackLightIcon, ArchiveOwl, BrushIcon } from '@assets/icons';
import { css } from "@emotion/react";

const ArchiveContainer = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  background: linear-gradient(180deg, #f1e7f9 0%, #ffffff 50%, #f1e7f9 100%);
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  position: relative;
  
  @media (max-aspect-ratio: 9/16) {
    /* 세로가 긴 화면 (대부분의 모바일) */
    background: linear-gradient(180deg, #f1e7f9 0%, #ffffff 25%, #f1e7f9 100%);
    background-attachment: fixed;
  }
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

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  position: relative;
`;

const IconSection = styled.div`
    position: relative;
`;

const TextSection = styled.div`
    margin-top: 40px;
`;

const Wait = styled.h2`
    font-family: 'Noto Sans KR', sans-serif;
    color: #1d1d1d;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-align: center;
`;

const Ment = styled.p`
    font-family: 'Noto Sans KR', sans-serif;
    color: #545656;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    white-space: pre-line;
`;

const Archive = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <ArchiveContainer>
            <Header>
                <BackLightIcon 
                css={css`
                    width: 24px;
                    height: 21px;
                    cursor: pointer;
                    margin-top: 2px;
                `}
                onClick={handleBack} />
            </Header>
            <Content>
                <IconSection>
                    <BrushIcon 
                    css={css`
                        width: 147px;
                        height: 147px;
                        position: absolute;
                        top: 85px;
                        left: 10px;
                    `}
                    />
                    <ArchiveOwl 
                    css={css`
                        margin-top: 183px;
                    `}
                    />
                </IconSection>
                <TextSection>
                    <Wait>
                        기다려주세요!
                    </Wait>
                    <Ment>
                        {'더 좋은 서비스를 위해\n페이지 점검 중입니다. 🔥'}
                    </Ment>
                </TextSection>
            </Content>
        </ArchiveContainer>
    );
}

export default Archive;