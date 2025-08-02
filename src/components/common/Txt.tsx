import styled from "@emotion/styled";

interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
  fontSize?: string;
  fontWeight?: number;
  textAlign?: string;
  color?: string;
  align?: string;
  lineHeight?: string;
  fontFamily?: string;
  letterSpacing?: string;
  width?: string;
  height?: string;
}

const Txt = styled.span<TextProps>`
  font-size: ${({ fontSize }) => fontSize || "inherit"};
  font-weight: ${({ fontWeight }) => fontWeight || "inherit"};
  font-family: ${({ fontFamily }) => fontFamily || "inherit"};
  text-align: ${({ textAlign }) => textAlign || "inherit"};
  line-height: ${({ lineHeight }) => (lineHeight ? lineHeight : "inherit")};
  color: ${({ color }) => color || "black"};
  text-align: ${({ align }) => align || "inherit"};
  letter-spacing: ${({ letterSpacing }) => letterSpacing || "inherit"};
  width: ${({ width }) => width || "auto"};
  height: ${({ height }) => height || "auto"};
  flex-shrink: 0;
`;

export default Txt;
