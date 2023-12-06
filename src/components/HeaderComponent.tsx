// Header.tsx
import React from "react";
import styled from "styled-components";
import { ColorFilter } from "./ColorFilter";
import { saveAsImage } from "../utils/saveAsImage";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const NavButton = styled.button`
  padding: 2px 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
`;

const SearchInput = styled.input`
  border-radius: 10px;
  padding: 2px 8px;
  border: 1px solid #00d3c8;
`;

const InputGetFile = styled.input`
  border-radius: 8px;
  border: 1px solid #00bcc4;
`;

interface HeaderProps {
  headerRef: React.RefObject<HTMLHeadElement>;
  currentDate: Date;
  searchText: string;
  setSearchText: (text: string) => void;
  setPrevMonth: () => void;
  setNextMonth: () => void;
  exportToJson: () => void;
  importFromJson: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HeaderComponent: React.FC<HeaderProps> = ({
  headerRef,
  currentDate,
  searchText,
  setSearchText,
  setPrevMonth,
  setNextMonth,
  exportToJson,
  importFromJson,
}) => {
  return (
    <Header ref={headerRef}>
      <div style={{ display: "flex", columnGap: "10px", alignItems: "center" }}>
        <NavButton onClick={setPrevMonth}>&#60;</NavButton>
        <NavButton onClick={setNextMonth}>&#62;</NavButton>
        <h1>
          {currentDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </h1>
      </div>

      <div style={{ display: "flex", columnGap: "10px", flexWrap: "wrap" }}>
        <SearchInput
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search tasks"
        />

        <ColorFilter />
        <button onClick={exportToJson}>Export</button>
        <InputGetFile type="file" onChange={importFromJson} />
        <button onClick={() => saveAsImage(".calendar")}>Save as Image</button>
      </div>
    </Header>
  );
};
