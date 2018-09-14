import React from 'react';
import styled, { css } from 'styled-components';
import { Link as RawLink } from 'react-router-dom';

export const defaultLinkCss = css`
  color: #264dd9;
  font-weight: 600;
  cursor: default;

  &:hover {
    color: #2f2670;
    cursor: pointer;
  }
`;

const Link = ({ children, className, style, to }) => (
  <RawLink className={className} style={style} to={to}>
    {children}
  </RawLink>
);

const StyledLink = styled(Link)`
  ${defaultLinkCss};

  ${({ href, to }) =>
    !(href || to) &&
    css`
      color: #78818c;
    `} &:hover {
    ${({ href, to }) =>
      !(href || to) &&
      css`
        color: #78818c;
      `};
  }
`;

export const A = StyledLink.withComponent('a');

export default StyledLink;
