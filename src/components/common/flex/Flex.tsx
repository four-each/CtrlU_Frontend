import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  gap?: React.CSSProperties["gap"];
  padding?: React.CSSProperties["padding"];
  margin?: React.CSSProperties["margin"];
  radius?: React.CSSProperties["borderRadius"];
  bgColor?: React.CSSProperties["backgroundColor"];
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  children: React.ReactNode;
}

export const Row = (props: FlexProps) => {
  const {
    justify: justify,
    align: align,
    radius: radius,
    bgColor: bgColor,
    children,
    ...others
  } = props;

  return (
    <Flex
      {...others}
      justify={justify}
      align={align}
      radius={radius}
      bgColor={bgColor}
      direction={"row"}
    >
      {children}
    </Flex>
  );
};

export const Col = (props: FlexProps) => {
  const {
    justify: justify,
    align: align,
    radius: radius,
    bgColor: bgColor,
    children,
    ...others
  } = props;

  return (
    <Flex
      {...others}
      justify={justify}
      align={align}
      radius={radius}
      bgColor={bgColor}
      direction={"column"}
    >
      {children}
    </Flex>
  );
};

interface StyledFlexProps {
  direction: React.CSSProperties["flexDirection"];
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  radius?: React.CSSProperties["borderRadius"];
  padding?: React.CSSProperties["padding"];
  margin?: React.CSSProperties["margin"];
  gap?: React.CSSProperties["gap"];
  bgColor?: React.CSSProperties["backgroundColor"];
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
}

const Flex = styled.div<StyledFlexProps>`
  position: relative;
  display: flex;
  flex-direction: ${(props) => props.direction};
  ${({ align }) =>
    align &&
    css`
      align-items: ${align};
    `}
  ${({ justify }) =>
    justify &&
    css`
      justify-content: ${justify};
    `}
  ${({ gap }) =>
    gap &&
    css`
      gap: ${gap}px;
    `}
  width: 100%;
  ${({ padding }) =>
    padding &&
    css`
      padding: ${padding};
    `}
  ${({ margin }) =>
    margin &&
    css`
      margin: ${margin};
    `}
    ${({ radius }) =>
    radius &&
    css`
      border-radius: ${radius};
    `}
    ${({ bgColor }) =>
    bgColor &&
    css`
      background-color: ${bgColor};
    `}
  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `}
  ${({ height }) =>
    height &&
    css`
      height: ${height};
    `}
`;
