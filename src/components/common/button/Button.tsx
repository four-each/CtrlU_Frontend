import { css } from "@emotion/react";
import Txt from "../Txt";
import { colors } from "@styles/theme";

type Props = {
  onClick?: () => void;
  textColor?: string;
  bgColor?: string;
  title?: string;
  disabled?: boolean;
  shadow?: boolean;
};

export default function Button({
  onClick,
  textColor,
  bgColor,
  title,
  shadow,
}: Props) {
  return (
    <button
      onClick={onClick}
      css={css`
        width: 100%;
        height: 56px;
        background-color: ${bgColor || colors.purple1};
        box-shadow: ${shadow ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none"};
        border: none;
        border-radius: 5rem;
        cursor: pointer;
      `}
    >
      <Txt fontSize="1.8rem" color={textColor || colors.textBlack}>
        {title || "버튼"}
      </Txt>
    </button>
  );
}
