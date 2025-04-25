import { css } from "@emotion/react";

type IconContainerProps = {
  children: React.ReactNode;
  width?: string;
  height?: string;
  onClick?: () => void;
};

const IconContainer = ({
  width,
  children,
  height,
  onClick,
}: IconContainerProps) => {
  return (
    <div
      onClick={onClick}
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${width || "100%"};
        height: ${height || "100%"};
        background-color: transparent;
        flex-shrink: 0;
      `}
    >
      {children}
    </div>
  );
};

export default IconContainer;
