import { BackIcon } from "@assets/icons";
import { Row } from "@components/common/flex/Flex";
import { colors } from "@styles/theme";
import Txt from "../Txt";
import IconContainer from "../container/IconContainer";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";

type HeaderProps = {
  title?: string;
  isBack: boolean;
  isRight: boolean;
  onBack?: () => void;
  onRight?: () => void;
  rightIcon?: React.ReactNode;
};

const Header = (props: HeaderProps) => {
  const navigate = useNavigate();
  const {
    title,
    isBack,
    isRight,
    onRight,
    onBack = () => navigate(-1),
    rightIcon,
  } = props;

  return (
    <Row
      justify="space-between"
      align="center"
      bgColor={colors.purple1}
      width={"100%"}
      height={"60px"}
      padding={"0 16px"}
    >
      <IconContainer width="24px" height="100%" onClick={onBack}>
        {isBack && <BackIcon />}
      </IconContainer>
      <div
        css={css`
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        {title && (
          <Txt
            color={colors.textBlack}
            fontSize={"18px"}
            fontWeight={500}
            textAlign={"center"}
          >
            상세
          </Txt>
        )}
      </div>

      <IconContainer width="24px" height="100%" onClick={onRight}>
        {isRight && rightIcon ? rightIcon : null}
      </IconContainer>
    </Row>
  );
};

export default Header;
