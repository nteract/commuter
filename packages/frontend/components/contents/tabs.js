// @flow
import React from "react";

import { theme } from "../../theme";

export default class Tabs extends React.Component {
  render() {
    return (
      <div>
        <div className="tabs">
          {this.props.items.map((item, index) =>
            <a
              key={index}
              href="#"
              className={item.active ? "active" : ""}
              onClick={this.handleClick}
            >
              {item.name}
            </a>
          )}
        </div>
        {this.props.children}
        <style jsx>{`
          div.tabs {
            width: 100%
            display: flex;
            justify-content: flex-start;
            margin-bottom: 10px;
          }
          
          a {
            margin-right: 10px;
          }

          a.active {
            color: ${theme.active};
            font-weight: 500;
            text-decoration: none;
            cursor: default;
          }

          a:hover {
            text-decoration: underline;
          }
          
          a.active:hover {
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  }

  handleClick = (event: SyntheticInputEvent) => {
    this.props.onChange(event.target.innerText);
  };
}
