function rand(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randHsl() {
  return `"hsl(${rand(359)} 100% ${rand(40) + 20}%)"`;
}

// Generate ship images with random color scheme
// the string is taken from frontend/images/spaceship-draft3-minimised.svg
// Remove the <!-- --> comments as needed
export const rawStringsArr = new Array(69).fill("").map(
  () =>
    `<svg width="500" height="500" version="1.1" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <!-- The frame/border -->
      <g fill=${randHsl()}>
          <rect x="9" y="0" width="2" height="1"/>
          <rect x="8" y="1" width="1" height="1"/>
          <rect x="11" y="1" width="1" height="1"/>
          <rect x="1" y="2" width="1" height="1"/>
          <rect x="18" y="2" width="1" height="1"/>
          <rect x="7" y="2" width="1" height="14"/>
          <rect x="12" y="2" width="1" height="14"/>
          <rect x="0" y="3" width="1" height="13"/>
          <rect x="19" y="3" width="1" height="13"/>
          <rect x="2" y="3" width="1" height="5"/>
          <rect x="17" y="3" width="1" height="5"/>
          <rect x="9" y="3" width="2" height="1"/>
          <rect x="8" y="4" width="1" height="1"/>
          <rect x="11" y="4" width="1" height="1"/>
          <rect x="9" y="5" width="2" height="1"/>
          <rect x="3" y="8" width="1" height="5"/>
          <rect x="16" y="8" width="1" height="5"/>
          <rect x="4" y="9" width="2" height="1"/>
          <rect x="14" y="9" width="2" height="1"/>
          <rect x="6" y="8" width="1" height="1"/>
          <rect x="13" y="8" width="1" height="1"/>
          <rect x="2" y="13" width="3" height="1"/>
          <rect x="15" y="13" width="3" height="1"/>
          <rect x="1" y="14" width="1" height="1"/>
          <rect x="18" y="14" width="1" height="1"/>
          <rect x="5" y="14" width="1" height="2"/>
          <rect x="14" y="14" width="1" height="2"/>
          <rect x="6" y="16" width="3" height="1"/>
          <rect x="11" y="16" width="3" height="1"/>
          <rect x="8" y="17" width="1" height="1"/>
          <rect x="11" y="17" width="1" height="1"/>
          <rect x="7" y="18" width="1" height="1"/>
          <rect x="12" y="18" width="1" height="1"/>
          <rect x="7" y="19" width="6" height="1"/>
      </g>
      <!-- Both wings -->
      <g fill=${randHsl()}>
          <rect x="1" y="3" width="1" height="11"/>
          <rect x="2" y="8" width="1" height="5"/>
          <rect x="18" y="3" width="1" height="11"/>
          <rect x="17" y="8" width="1" height="5"/>
      </g>
      <!-- Ship body -->
      <g fill=${randHsl()}>
          <rect x="8" y="5" width="1" height="11"/>
          <rect x="11" y="5" width="1" height="11"/>
          <rect x="9" y="6" width="1" height="12"/>
          <rect x="10" y="6" width="1" height="12"/>
          <rect x="8" y="18" width="4" height="1"/>
      </g>
      <!-- Extension from body to the wings -->
      <g fill=${randHsl()}>
          <rect x="4" y="10" width="1" height="3"/>
          <rect x="15" y="10" width="1" height="3"/>
          <rect x="5" y="10" width="1" height="4"/>
          <rect x="14" y="10" width="1" height="4"/>
          <rect x="6" y="9" width="1" height="7"/>
          <rect x="13" y="9" width="1" height="7"/>
      </g>
      <!-- Cockpit window -->
      <g fill=${randHsl()}>
          <rect x="9" y="4" width="2" height="1"/>
      </g>
      <!-- Cockpit -->
      <g fill=${randHsl()}>
          <rect x="8" y="2" width="1" height="2"/>
          <rect x="9" y="1" width="2" height="2"/>
          <rect x="11" y="2" width="1" height="2"/>
      </g>
  </svg>`
);

const encodedStringsArr = rawStringsArr.map(
  (string) => `data:image/svg+xml;base64,${btoa(string)}`
);

export default encodedStringsArr;
