import React from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export const FlatContainer = styled.div`
  width: 96%;
  max-width: 300px;
  margin: 0 auto;
  border-radius: 12px;
  padding: 15px;
  background-color: white;
  @media (max-width: 770px) {
    max-width: 98%;
  }
`;

export const WarningContainer = FlatContainer.extend`
  background-color: rgba(255, 234, 142, 0.75);
`;

export const H1 = styled.p`
  font-size: 4rem;
  font-weight: bold;
  line-height: 1.1;
  @media (max-width: 770px) {
    margin-left: 2%;
    font-size: 3rem;
  }
`;

export const H2 = styled.p`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  @media (max-width: 770px) {
    font-size: 1.5rem;
  }
`;

export const H3 = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  @media (max-width: 770px) {
    font-size: 1.25rem;
  }
`;

export const H4 = styled.p`
  font-size: 1rem;
  font-weight: 700;
`;

export const SocialUsername = ({ link, ...restProps }) => {
  const result = /\/([^/]+)(\/?)$/.exec(link);
  const username = result && result[1] ? result[1] : link;

  return <span {...restProps}>{username || link}</span>;
};

export const CopyButton = styled(
  class extends React.Component {
    state = { copied: false };

    onCopy = () => {
      this.setState({ copied: true }, () => {
        setTimeout(() => this.setState({ copied: false }), 5000);
      });
    };

    render() {
      const { className, style, value, name } = this.props;
      const { copied } = this.state;
      return (
        <div className={className} style={style}>
          <CopyToClipboard text={value} onCopy={this.onCopy}>
            <span>{copied ? '✓ copied' : `⎘ copy ${name}`}</span>
          </CopyToClipboard>
        </div>
      );
    }
  },
)`
  position: relative;
  cursor: pointer;
`;
