import { css } from "@emotion/react";

export const globalStyles = css`
  @font-face {
    font-family: "NotoSansKR";
    src: url("/fonts/NotoSansKR-VariableFont_wght.ttf") format("ttf");
    font-weight: 100 900;
    font-display: swap;
    font-style: normal;
  }
  * {
    box-sizing: border-box;
    font-family: "NotoSansKR", sans-serif;
  }

  html {
    box-sizing: border-box;
    font-family: "NotoSansKR", sans-serif;
    font-size: 62.5%;
  }

  html,
  body,
  #root {
    width: 100vw;
    min-height: 100vh; /* 기본 브라우저 */
    min-height: -webkit-fill-available; /* iOS Safari 뷰포트 채우기 */
    min-height: 100dvh;
    max-width: 960px;
    overflow-x: hidden;
    margin: 0 auto;
    padding: 0;
    background-color: white;

    -webkit-overflow-scrolling: touch !important;
    -ms-overflow-style: none;
    scrollbar-width: none;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  button {
    padding: 0;
    overflow: visible;
    cursor: pointer;
    background: inherit;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
`;
