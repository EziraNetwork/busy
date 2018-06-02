import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const isNews = (match, location) => location.pathname.match(/trending/);
const isWallet = (match, location) => location.pathname.match(/wallet/);
const isReplies = (match, location) => location.pathname.match(/replies/);

const Sidenav = ({ username }) => (
  <div>
    {true && (
      <ul className="Sidenav">
        <li>
          <NavLink to={`/`} activeClassName="Sidenav__item--active" exact>
            {/* <i className="iconfont icon-home" /> */}
            <FormattedMessage id="home" defaultMessage="Home" />
          </NavLink>
        </li>
        <li>
          <NavLink to={`/boards`}>
            {/* <i className="iconfont icon-home" /> */}
            <FormattedMessage id="boards" defaultMessage="Boards" />
          </NavLink>
        </li>
        <li>
          <NavLink to={`/feeds`}>
            {/* <i className="iconfont icon-home" /> */}
            <FormattedMessage id="feeds" defaultMessage="Feeds" />
          </NavLink>
        </li>
				<li>
					<NavLink to="/trending" activeClassName="Sidenav__item--active" isActive={isNews}>
						{/* <i className="iconfont icon-headlines" /> */}
						<FormattedMessage id="news" defaultMessage="News" />
					</NavLink>
				</li>
        <li>
          <NavLink to={`/groups`}>
            {/* <i className="iconfont icon-home" /> */}
            <FormattedMessage id="groups" defaultMessage="Groups" />
          </NavLink>
        </li>
        <li>
          <NavLink to={`/events`}>
            {/* <i className="iconfont icon-home" /> */}
            <FormattedMessage id="events" defaultMessage="Events" />
          </NavLink>
        </li>
        <li>
					<NavLink to="/wallet" activeClassName="Sidenav__item--active" isActive={isWallet}>
            {/* <i className="iconfont icon-home" /> */}
            <FormattedMessage id="wallet" defaultMessage="Wallet" />
          </NavLink>
        </li>
        <li>
          <NavLink to={`/exchange`}>
            {/* <i className="iconfont icon-home" /> */}
            <FormattedMessage id="exchange" defaultMessage="Exchange" />
          </NavLink>
        </li>
        <li>
          <NavLink to={`/marketplace`}>
            {/* <i className="iconfont icon-home" /> */}
            <FormattedMessage id="market_place" defaultMessage="Market Place" />
          </NavLink>
        </li>
        <li>
          <NavLink to={`/applications`}>
            {/* <i className="iconfont icon-home" /> */}
            <FormattedMessage id="applications" defaultMessage="Applications" />
          </NavLink>
        </li>
        <li>
          <NavLink to={`/network`}>
            {/* <i className="iconfont icon-home" /> */}
            <FormattedMessage id="network" defaultMessage="Network" />
          </NavLink>
        </li>
        {username && (
					<li>
						<NavLink to={`/saved`}>
							{/* <i className="iconfont icon-home" /> */}
							<FormattedMessage id="saved" defaultMessage="Saved" />
						</NavLink>
					</li>
				)}
				{username && (
					<li>
						<NavLink to={`/music`}>
							{/* <i className="iconfont icon-home" /> */}
							<FormattedMessage id="music" defaultMessage="Music" />
						</NavLink>
					</li>
				)}
        {/* <li>
          <NavLink to={`/@${username}`}>
            <i className="iconfont icon-mine" />
            <FormattedMessage id="my_profile" defaultMessage="My profile" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/" activeClassName="Sidenav__item--active" exact>
            <i className="iconfont icon-clock" />
            <FormattedMessage id="feed" defaultMessage="Feed" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/trending" activeClassName="Sidenav__item--active" isActive={isNews}>
            <i className="iconfont icon-headlines" />
            <FormattedMessage id="news" defaultMessage="News" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/replies" activeClassName="Sidenav__item--active" isActive={isReplies}>
            <i className="iconfont icon-message" />
            <FormattedMessage id="replies" defaultMessage="Replies" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/wallet" activeClassName="Sidenav__item--active" isActive={isWallet}>
            <i className="iconfont icon-wallet" />
            <FormattedMessage id="wallet" defaultMessage="Wallet" />
          </NavLink>
        </li> */}
      </ul>
    )}
  </div>
);

Sidenav.propTypes = {
  username: PropTypes.string,
};

Sidenav.defaultProps = {
  username: undefined,
};

export default Sidenav;
