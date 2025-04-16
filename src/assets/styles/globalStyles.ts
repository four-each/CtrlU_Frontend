import { css } from "@emotion/react";

export const globalStyles = css`
  /* @font-face {
    font-family: "JejuGothic";
    src: url("/fonts/JejuGothicOTF.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: "JejuMyeongjo";
    src: url("fonts/JejuMyeongjoOTF.otf") format("opentype");
    font-weight: normal;
    font-style: normal;
  } */
  * {
    box-sizing: border-box;
    font-family: "JejuGothic", "JejuMyeongjo", sans-serif;
  }

  html {
    box-sizing: border-box;
    font-family: "JejuGothic", "JejuMyeongjo", sans-serif;
    font-size: 62.5%;
  }

  html,
  body,
  #root {
    width: 100vw;
    min-height: 100vh; /* 기본 브라우저 */
    min-height: -webkit-fill-available; /* iOS Safari 뷰포트 채우기 */
    min-height: 100dvh;
    overflow-x: hidden;
    margin: 0;
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
