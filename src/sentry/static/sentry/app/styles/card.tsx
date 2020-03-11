import {css} from '@emotion/core';

import {Theme} from 'app/utils/theme';

type CardStyleProps = {
  theme: Theme;
  /**
   * Adds hover and focus states to the card
   */
  withHover?: boolean;
};

const hoverStyle = css`
  &:focus,
  &:hover {
    box-shadow: 0px 0px 0px 6px rgba(209, 202, 216, 0.2);
    position: relative;
    outline: none;
  }

  &:active {
    box-shadow: 0px 0px 0px 6px rgba(209, 202, 216, 0.5);
  }

  /* This is to ensure the graph is visually clickable */
  * {
    cursor: pointer;
  }
`;

const cardStyles = ({withHover = false, theme}: CardStyleProps) => css`
  background: ${theme.white};
  border: 1px solid ${theme.borderLight};
  border-radius: ${theme.borderRadius};
  display: flex;
  align-items: stretch;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.2s ease;
  cursor: pointer;
  text-align: left;
  padding: 0;

  ${withHover && hoverStyle};
`;

export default cardStyles;
