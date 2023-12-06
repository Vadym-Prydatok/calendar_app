import React from "react";
import Github from "@uiw/react-color-github";
import { colorsForLabels } from "../data/colorsForLabels";
import { setColor } from "../features/colorSlice";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";

export const ColorPicker: React.FC = () => {
  const color = useAppSelector((state) => state.color);

  const dispatch = useAppDispatch();

  return (
    <>
      <Github
        color={color || "#fff"}
        style={
          {
            maxWidth: 140,
            "--github-background-color": color,
          } as React.CSSProperties
        }
        onChange={(color) => {
          dispatch(setColor(color.hex));
        }}
        rectRender={(props) => {
          if (props.key == 4) {
            return (
              <button
                style={{ height: "26px", padding: "1px 10px" }}
                key={props.key}
                onClick={() => dispatch(setColor(null))}
              >
                x
              </button>
            );
          }
        }}
        colors={colorsForLabels}
      />
    </>
  );
};
