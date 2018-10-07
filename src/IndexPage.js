import React, { Component } from 'react';
import styled from 'styled-components';

import { getFeedItemsFromCache, getRanking, isValidFeedItem, enhanceFeedItem } from './api';
import AppContext from './Context';
import { pageView } from './Analytics';
import { getFeed } from './Feed';
import Hero from './Hero';
import { PromotionBox } from './promotion/PromotionBox';
import { FlatContainer } from './Components';
import FeedTypeSwitcher from './FeedTypeSwitcher';
import StatusBox from './StatusBox';

const ExplainerBox = styled(FlatContainer)`
  margin-top: 20px;

  @media (max-width: 770px) {
    mergin-top: 10px;
  }
`;

const { REACT_APP_DEFAULT_TOKEN_ID: DEFAULT_TOKEN_ID } = process.env;

const fetchPopularFeed = async () => {
  const { items } = await getRanking(
    [
      {
        algorithm: 'cryptoverse_last_week_popular_feed',
      },
    ],
    'api/decorate-with-opensea',
  );
  return items.filter(isValidFeedItem).map(enhanceFeedItem);
};

const NewestFeed = getFeed(getFeedItemsFromCache(), true, true, undefined, (f0, f1) => f1.created_at - f0.created_at);
const PopularFeed = getFeed(fetchPopularFeed, false, false);
const ActiveFeed = getFeed(getFeedItemsFromCache('cache-cryptoverse-active-feed'), true, false);

export default class IndexPage extends Component {
  state = { feedType: 'new' };

  componentDidMount() {
    pageView();
  }

  changeFeedType = (feedType) => {
    if (this.state.feedType !== feedType) {
      this.setState({ feedType });
    }
  };

  render() {
    const { feedType } = this.state;
    const defaultUnloggedFeeds = [FeedTypeSwitcher.NEW, FeedTypeSwitcher.POPULAR, FeedTypeSwitcher.ACTIVE];
    return (
      <React.Fragment>
        <div className="columns ordered-mobile">
          <div className="column is-9 fl-1">
            <StatusBox check={[StatusBox.Web3Locked]} style={{ marginBottom: '30px' }}>
              <Hero />
            </StatusBox>
            <FeedTypeSwitcher
              type={feedType}
              onChange={this.changeFeedType}
              style={{ marginBottom: '2em' }}
              options={defaultUnloggedFeeds}
            />
            {feedType === FeedTypeSwitcher.NEW && <NewestFeed />}
            {feedType === FeedTypeSwitcher.POPULAR && <PopularFeed />}
            {feedType === FeedTypeSwitcher.ACTIVE && <ActiveFeed />}
          </div>
          <div className="column is-3">
            <FlatContainer>
              <AppContext.Consumer>
                {({ boostStore: { getBoosts, getSupportings } }) => (
                  <PromotionBox
                    getBoosts={getBoosts}
                    getSupportings={getSupportings}
                    token={DEFAULT_TOKEN_ID}
                    showPurrmoter={true}
                  />
                )}
              </AppContext.Consumer>
            </FlatContainer>
            <ExplainerBox>
              This feed represents all messages posted on Tok'n'talk. Use it to discover new valuable communities and
              interesting characters.
            </ExplainerBox>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
