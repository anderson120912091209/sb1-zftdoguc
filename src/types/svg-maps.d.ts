declare module '@svg-maps/taiwan' {
  interface Location {
    id: string;
    name: string;
    path: string;
  }

  interface SvgMap {
    viewBox: string;
    locations: Location[];
  }

  const taiwan: SvgMap;
  export default taiwan;
} 