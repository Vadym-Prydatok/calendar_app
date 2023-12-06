import { colorsForLabels } from "../data/colorsForLabels";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setColorFilter } from "../features/colorFilterSlice";
import styled from "styled-components";

const ColorList = styled.ul`
  display: flex;
  list-style: none;
  cursor: pointer;
  border: 2px solid #00d3c8;
`;

const ColorItem = styled.li<{ $color: string; $selected: boolean }>`
  background-color: ${(props) => props.$color};
  width: 20px;
  height: 20px;
  cursor: pointer;
  text-align: center;
  border: ${(props) => (props.$selected ? '2px solid white' : 'none')};

  &:hover {
    border: 1px solid white;
  }
`;

export const ColorFilter = () => {
  const colorsFilter = useAppSelector((state) => state.colorFilter);
  const dispatch = useAppDispatch();
  
  return (
    <>
      <ColorList>
      {colorsForLabels.map((color, index) => (
          <ColorItem
            key={index}
            onClick={() => dispatch(setColorFilter(color))}
            $color={color}
            $selected={colorsFilter.includes(color)}
          >
            {color === "null" && "X"}
          </ColorItem>
        ))}
      </ColorList>
    </>
  );
};
