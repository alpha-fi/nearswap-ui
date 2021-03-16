import React from "react";
import { Dropdown } from "react-bootstrap";

const HeaderDropdownItem = ({ link, title }) => {
  return (
    <Dropdown.Item className="header-network-item-dropdown" href={link}>
      <div className="network-icon"></div>
      {title}
    </Dropdown.Item>
  );
};

const HeaderNetworkDropdown = () => (
      <Dropdown>
        <Dropdown.Toggle className="header-network" variant="secondary">
          <div className="network-icon"></div>
          {window.nearNetworkId}
          <img
            className="icon-right"
            src="/assets/icon-network-right.svg"
          />
          <img
            src="/assets/down-blue-arrow.svg"
            className="dropdown-arrow"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu className="header-network-dropdown-menu">
          {["mainnet", "testnet", "betanet", "guildnet"].map((network) => {
            return (
              <HeaderDropdownItem
                key={network}
                title={network}
                link={network}
              />
            );
          })}
        </Dropdown.Menu>
        <style jsx global>{`
          .header-network {
            background: #ffffff;
            border: 2px solid #f1f1f1;
            box-sizing: border-box;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
            border-radius: 50px;
            color: #000000;
            text-transform: capitalize;
            width: 154px;
            height: 33px;
            padding: 3px 2px;
            font-size: 14px;
            outline: none;
          }

          .header-network:hover,
          .header-network:focus,
          .header-network:active,
          .header-network:focus:active,
          .show > .header-network.dropdown-toggle {
            background: #f7f7f7 !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: 0 solid #f1f1f1 !important;
          }
          .header-network.dropdown-toggle {
            border: 2px solid #f1f1f1;
          }

          .btn-secondary:focus {
            box-shadow: none;
          }

          .header-network-dropdown-menu {
            background: #ffffff;
            padding: 12px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            border: none;
          }

          .dropdown-menu {
            min-width: 154px;
          }

          .header-network-item-dropdown {
            font-size: 14px;
            letter-spacing: 1.8px;
            color: #8d8d8d;
            padding: 6px 40px 6px 6px;
            border-radius: 3px;
            text-transform: capitalize;
          }

          .header-network-item-dropdown:hover,
          .header-network-item-dropdown:active {
            background-color: #e6e6e6;
          }

          .network-icon {
            display: inline-block;
            margin-right: 8px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${window.nearNetworkId === "mainnet"
              ? "#00C08B"
              : window.nearNetworkId === "testnet"
              ? "#E9B870"
              : window.nearNetworkId === "betanet"
              ? "#00C1DE"
              : "#0072CE"};
          }

          .icon-right {
            height: 15px;
            width: 15px;
            margin-left: 16px;
            margin-top: -3px;
          }
        `}</style>
      </Dropdown>
);

export default HeaderNetworkDropdown;
