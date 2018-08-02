import React, { Component } from 'react';

import { pageView } from './Analytics';
import { ConnectedFeed, FeedContainer } from './Feed';
import Hero from './Hero';
import { FeedCatvertised } from './Catvertised';
import { HeaderSpacer } from './Header';

const { REACT_APP_DEFAULT_OWNER: DEFAULT_OWNER } = process.env;
const { REACT_APP_DEFAULT_TOKEN: DEFAULT_TOKEN } = process.env;

export default class IndexPage extends Component {
  componentDidMount() {
    pageView();
    window.scrollTo(0, 0);
    this.props.getFeedItems();
    this.refreshInterval = setInterval(() => this.props.getNewFeedItems(), 15000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  render() {
    return (
      <React.Fragment>
        <HeaderSpacer />
        <Hero />
        <FeedContainer>
          <FeedCatvertised owner={DEFAULT_OWNER} token={DEFAULT_TOKEN}/>
          <ConnectedFeed className="column is-6" />
        </FeedContainer>
      </React.Fragment>
    );
  }
}
