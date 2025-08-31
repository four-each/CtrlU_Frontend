import { TrashIcon } from "@assets/icons";
import { Col, Row } from "@components/common/flex/Flex";
import Header from "@components/common/header/Header";
import Txt from "@components/common/Txt";
import Timer, { FinishHandler } from "@components/timer/Timer";
import styled from "@emotion/styled";
import { colors } from "@styles/theme";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import profileIcon from "../../assets/icons/home/profile.svg";
import { useGetTodoDetail } from "../../hooks/api/todo/useGetTodoDetail";
import { useGiveUpTodo } from "../../hooks/api/todo/useGiveUpTodo";
import { useDeleteTodo } from "../../hooks/api/todo/useDeleteTodo";

const Detail = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const finishHandler = useRef<FinishHandler>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'complete' | 'quit' | 'delete'>('complete');
  const navigate = useNavigate();

  // API 데이터 조회
  const { data: todoDetail, isLoading, isError, error } = useGetTodoDetail(id || '');
  
  // 미션 포기 훅
  const giveUpMutation = useGiveUpTodo();
  
  // 미션 삭제 훅
  const deleteMutation = useDeleteTodo();

  useEffect(() => {
    if (isError) {
      console.error('[Detail] 할일 상세 조회 에러', error);
    }
  }, [isError, error]);

  // 페이지 마운트 시 스크롤을 맨 위로 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 미션 포기 처리
  const handleGiveUp = async () => {
    if (!id) return;
    
    try {
      const result = await giveUpMutation.mutateAsync(id);
      if (result.status === 200) {
        console.log("미션 포기 성공");
        navigate('/');
      }
    } catch (error) {
      console.error("미션 포기 실패:", error);
    }
    setShowModal(false);
  };

  // 미션 삭제 처리
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const result = await deleteMutation.mutateAsync(id);
      if (result.status === 200) {
        console.log("미션 삭제 성공");
        navigate('/');
      }
    } catch (error) {
      console.error("미션 삭제 실패:", error);
    }
    setShowModal(false);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <Container>
        <FixedHeaderContainer>
          <Header
            isBack={true}
            isRight={false}
            title=""
            userName=""
          />
        </FixedHeaderContainer>
        <ContentContainer>
          <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
        </ContentContainer>
      </Container>
    );
  }

  // 에러 상태
  if (isError || !todoDetail) {
    return (
      <Container>
        <FixedHeaderContainer>
          <Header
            isBack={true}
            isRight={false}
            title=""
            userName=""
          />
        </FixedHeaderContainer>
        <ContentContainer>
          <div style={{ textAlign: 'center', padding: '50px', color: '#bf6a6a' }}>
            할일 정보를 불러오는데 실패했습니다.
          </div>
        </ContentContainer>
      </Container>
    );
  }

  const actualIsMe = (todoDetail as any).result.isMine;
  const { result } = todoDetail as any;

  return (
    <Container>
      {/* 헤더를 고정된 상단 영역으로 분리 */}
      <FixedHeaderContainer>
        <Header
          isBack={true}
          isRight={true}
          rightIcon={actualIsMe ? <TrashIcon onClick={() => {
            setModalType('delete');
            setShowModal(true);
          }} /> : null}
          title={actualIsMe ? "" : "친구이름"}
          userName={actualIsMe ? "나" : "친구이름"}
        />
      </FixedHeaderContainer>

      {/* 콘텐츠 영역 */}
      <ContentContainer>
      <Col
        justify="flex-start"
        align="center"
        width="100%"
        height="100%"
        padding={"50px 0 40px"}
        gap={15}
      >
        <SmallImage 
          src={result.profileImage || profileIcon} 
          alt="프로필 이미지"
          onError={(e) => {
            e.currentTarget.src = profileIcon;
          }}
        />
        <Txt
          fontSize="24px"
          fontWeight={500}
          color={colors.textBlack}
          letterSpacing="0.0024rem"
        >
          {result.title}
        </Txt>
      </Col>
      <Timer
        durationTime={result.durationTime}
        challengeTime={result.challengeTime}
        timerRef={finishHandler}
      />
      {!actualIsMe && (
        <div style={{ marginBottom: '40px' }}></div>
      )}
      {actualIsMe && (
        <Row
          justify="center"
          align="center"
          gap={20}
          width="100%"
          padding={"20px 0 44px"}
        >
          <MissionButton 
            buttonType="quit"
            onClick={() => {
              setModalType('quit');
              setShowModal(true);
            }}
          >
            미션 포기
          </MissionButton>
          <MissionButton
            buttonType="complete"
            onClick={() => {
              setModalType('complete');
              setShowModal(true);
            }}
          >
            미션 완료
          </MissionButton>
        </Row>
      )}

      {/* 확인 모달 */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              {modalType === 'complete' ? '미션을 완료할까요?' : 
               modalType === 'quit' ? '미션을 포기할까요?' : 
               '미션을 삭제할까요?'}
            </ModalTitle>
            <ModalButtons>
              <ModalButton 
                buttonType="cancel"
                onClick={() => setShowModal(false)}
              >
                아니오
              </ModalButton>
              <ModalButton 
                buttonType="confirm"
                onClick={() => {
                  if (modalType === 'complete') {
                    finishHandler.current?.setFinished();
                    console.log("미션 완료");
                    navigate('/camera/complete', { state: { todoId: id, durationTime: result.durationTime } });
                  } else if (modalType === 'quit') {
                    handleGiveUp();
                  } else {
                    handleDelete();
                  }
                  setShowModal(false);
                }}
              >
                네
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      </ContentContainer>
    </Container>
  );
};

export default Detail;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: ${colors.white};
  margin: 0 auto;
  overflow-y: scroll;
  position: relative;
`;

const FixedHeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background-color: ${colors.white};
  z-index: 100;
`;

const ContentContainer = styled.div`
  padding-top: 60px;
`;

const SmallImage = styled.img`
  width: 35px;
  height: 35px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  background-color: ${colors.purple1};
  border: 2px solid ${colors.purple1};
`;

const MissionButton = styled.button<{ buttonType: "quit" | "complete" }>`
  padding: 12px 23px 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  font-size: 1.6rem;
  font-weight: 400;
  color: ${({ buttonType }) =>
    buttonType === "quit" ? colors.textBlack : colors.white};
  background-color: ${({ buttonType }) =>
    buttonType === "quit" ? colors.purple1 : colors.purple3};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 14px;
  padding: 40px 20px 20px;
  width: 297px;
  height: 148px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${colors.textBlack};
  text-align: center;
  margin-bottom: 20px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const ModalButton = styled.button<{ buttonType: "cancel" | "confirm" }>`
  width: 90px;
  height: 36px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 400;
  color: white;
  background-color: ${({ buttonType }) =>
    buttonType === "cancel" ? "#bababa" : "#ad8aca"};
  cursor: pointer;
`;
