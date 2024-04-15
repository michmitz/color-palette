"use client";
import React from "react";
import { ColorPicker } from "./ColorPicker";
import { ColorScheme } from "./ColorScheme";
import styled from "styled-components";
import { Dropdown } from "./Dropdown";

export type ColorFormat = "hex" | "rgb" | "hsl";
export const schemeTypes = [
  "monochrome",
  "analogic",
  "analogic-complement",
  "monochrome-light",
  "complement",
  "triad",
  "quad",
] as const;
export type SchemeType = (typeof schemeTypes)[number];

export const ColorSchemeContainer: React.FC = () => {
  const [colorInput, setColorInput] = React.useState<string>("");
  const [colorData, setColorData] = React.useState<any>(null);
  // const [gradientData, setGradientData] = React.useState<any>([]);
  const [format, setFormat] = React.useState<ColorFormat>("rgb");
  const [dropdownValue, setDropdownValue] = React.useState<SchemeType | null>(
    null
  );
  const [colorSchemes, setColorSchemes] = React.useState<any>([]);

  const getData = async (
    hexColor: string,
    count: number,
    mode: string,
    setData: (v: any) => void
  ) => {
    const res = await fetch(
      `https://www.thecolorapi.com/scheme?hex=${hexColor}&count=${count}&mode=${mode}`
    );

    if (res.status !== 200) {
      throw new Error("Failed to fetch colors");
    }
    const data = await res.json();

    setData(data);
  };

  React.useEffect(() => {
    if (colorInput) {
      setColorData(null);
      getData(
        colorInput.substring(1),
        6,
        dropdownValue || "analogic-complement",
        (v) => setColorData(v)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorInput]);

  React.useEffect(() => {
    if (dropdownValue && colorInput) {
      getData(colorInput.substring(1), 6, dropdownValue, (v) =>
        setColorData(v)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownValue]);

  React.useEffect(() => {
    // If six colors are fetched from color input
    if (colorData !== null) {
      console.log("color data", colorData);
      colorData.colors.forEach((color: any) => {
        // For each color fetched from color input, generate a new color scheme of 5 colors
        getData(color.hex.clean, 5, dropdownValue || "monochrome", (v) =>
          setColorSchemes((prevData: any) => [...prevData, v])
        );

        // Todo: Add gradients
        // const gradients = chroma.scale([`${colorInput}`, `${color.hex.value}`]).colors(3);

        // getData(color.hex.clean, 4, "analogic", (v) =>
        // setGradientData((prevData: any) => [
        //   ...prevData,
        //   [ gradients[0], gradients[1], gradients[2] ],
        // ])
        // );
      });
    }
  }, [colorData, colorInput, dropdownValue]);

  React.useEffect(() => {
    console.log("Color schemes", colorSchemes);
    colorSchemes.length &&
      colorSchemes.forEach((scheme: any) => {
        console.log("scheme", scheme);
      });
  }, [colorSchemes]);

  const handleSetColorInput = (v: string) => {
    // setGradientData([]);
    setColorInput(v);
  };

  const handleSetFormat = (v: ColorFormat) => {
    setFormat(v);
  };

  const handleSetDropdownValue = (v: SchemeType) => {
    setColorData(null);
    // setGradientData([]);
    setDropdownValue(v);
  };

  const FormatButton = styled.button<{ $selected: boolean }>`
    color: ${(props) => (props.$selected ? "green" : "black")};
    margin: 3px;
  `;

  return (
    <div>
      <div className="flex bg-white rounded-2xl shadow-2xl mb-10">
        <p className="font-comfortaa text-xl font-bold">CHOOSE A COLOR</p>
        <ColorPicker onChange={handleSetColorInput} colorInput={colorInput} />

        <Dropdown
          value={dropdownValue || "analogic"}
          dropdownValues={schemeTypes}
          onChange={handleSetDropdownValue}
        />

        <div>
          <FormatButton
            onClick={() => handleSetFormat("hex")}
            className="cursor-pointer font-bold"
            $selected={format === "hex"}
          >
            HEX
          </FormatButton>{" "}
          <FormatButton
            onClick={() => handleSetFormat("rgb")}
            className="cursor-pointer font-bold"
            $selected={format === "rgb"}
          >
            RGB
          </FormatButton>
          <FormatButton
            onClick={() => handleSetFormat("hsl")}
            className="cursor-pointer font-bold"
            $selected={format === "hsl"}
          >
            HSL
          </FormatButton>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {colorData &&
            colorData.colors.map((color: any, i: number) => {
              return (
                <div
                  style={{
                    backgroundColor: color.hex.value,
                    width: "100px",
                    height: "100px",
                    display: "flex",
                    flexDirection: "row",
                  }}
                  key={`${color}-${i}`}
                />
              );
            })}
        </div>

        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignSelf: 'center', marginTop: '20px', justifyContent: 'space-between', width: '80%' }}
        >
          {colorSchemes.length ? (
            colorSchemes.map((scheme: any, i: number) => {
              return (
                <div
                  style={{
                    backgroundColor: "white",
                    width: "400px",
                    height: "280px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderRadius: "10px",
                    boxShadow: "8px 8px 8px lightgray",
                  }}
                  key={`${scheme}-${i}`}
                >
                  {scheme.colors.map((color: any, i: number) => {
                    return (
                      <div
                        style={{
                          backgroundColor: color.hex.value,
                          width: "60px",
                          height: "80%",
                          borderRadius: '10px',
                        }}
                        key={`${color}-${i}`}
                      />
                    );
                  })}
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* {gradientData.length ? 
        // <>log gradients</>
        // <ColorScheme colors={gradientData} format={format} />
        
          gradientData.map((gradient, i) => {
            // console.log("Gradient", chroma(gradient[0]).rgba())
            return <GradientColor $color1={chroma(gradient[0]).css()} $color2={chroma(gradient[1]).css()} $color3={chroma(gradient[2]).css()} key={`${gradient[0]}-${i}`}/>
          }
        
      ) : colorInput ? (
        <>Loading</>
      ) : (
        <></>
      )} */}
    </div>
  );
};
