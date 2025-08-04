// import { COLORS } from "../../style";
// import { getColorStyle } from "../../style";
// import { getFontFamily } from "../../style-inputs/helpers/styles";
// import { PageLayoutProps } from "./schema";

// const widthBreakpoints: Record<string, number> = {
//   sm: 640,
//   md: 768,
//   lg: 1024,
//   xl: 1280,
//   "2xl": 1536,
// };

// export const PageLayoutStyle = ({
//   id,
//   props,
// }: {
//   id: string;
//   props: PageLayoutProps;
// }) => {
//   const defaults: Record<string, string> = {
//     "background-color":
//       getColorStyle(props.backgroundColor ?? COLORS.background.value) ?? "#fff",
//     color: getColorStyle(props.textColor ?? COLORS.foreground.value) ?? "#000",
//     "font-family": getFontFamily(props.fontFamily) ?? "inherit",
//     "font-size": "16px",
//     "font-weight": "400",
//     "letter-spacing": "0.15008px",
//     "line-height": "1.5",
//     margin: "0",
//     width: "100%",
//     "min-height": "100%",
//   };

//   let css = Object.entries(defaults)
//     .map(([key, value]) => `${key}: ${value};`)
//     .join("\n");

//   if (!props.fullWidth) {
//     css += Object.values(widthBreakpoints)
//       .map(
//         (value) => `
//       @media (max-width: ${value}px) {
//           max-width: ${value}px;
//       }`
//       )
//       .join("\n");

//     css += `margin: 0 auto;`;
//   }

//   return (
//     <style
//       dangerouslySetInnerHTML={{
//         __html: `#${id} { ${css} }`,
//       }}
//     />
//   );
// };
