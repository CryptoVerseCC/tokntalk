import React from 'react';
import { ConnectedCommentForm, CommentForm } from './CommentForm';
import { LinkedActiveEntityAvatar, IfActiveEntity } from './Entity';
import styled from 'styled-components';

const HeroContainer = styled.div``;

const AddStory = styled.div`
  box-shadow: rgba(118, 103, 170, 0.12) 0px 2rem 3rem -1.5rem;
  border-radius: 12px;
  display: flex;
  padding: 1.25rem;
  background-color: white;
  @media (max-width: 770px) {
    width: 96%;
    margin-left: 2%;
    padding: 1rem;
  }
`;

const Avatar = styled(LinkedActiveEntityAvatar)`
  width: 48px;
  height: 48px;
  margin-right: 15px;

  @media (max-width: 770px) {
    width: 48px;
    height: 48px;
    margin-right: 10px;
  }
`;

const Form = styled(CommentForm)`
  width: 100%;
  padding: 0px 50px 0px 0px;
`;

const Hero = (props) => (
  <IfActiveEntity>
    {(entity) => (
      <div {...props}>
        <HeroContainer>
          <AddStory>
            <Avatar />
            <ConnectedCommentForm Form={Form} />
          </AddStory>
        </HeroContainer>
      </div>
    )}
  </IfActiveEntity>
);

export default Hero;
