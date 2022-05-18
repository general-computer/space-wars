function rand(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randHsl() {
  return `"hsl(${rand(359)} 100% ${rand(40) + 20}%)"`;
}

// Generate ship images with random color scheme
// the string is taken from frontend/images/spaceship-draft2-minimised-optimised.svg
export const rawStringsArr = new Array(69).fill("").map(
  () =>
    `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="500" height="500" version="1.1" viewBox="0 0 132.29 132.29" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <rect id="sq" width="6.6146" height="6.6146"/>
        <rect id="rect-hz" width="13.229" height="6.6146"/>
        <rect id="rect-vt" width="6.6146" height="13.229"/>
      </defs>
     <!-- The frame/border -->
      <g fill=${randHsl()}>
        <use href="#sq" x="52.917" y="6.6146" />
        <use href="#sq" x="72.76" y="6.6146" />
        <use href="#sq" x="6.6146" y="13.229" />
        <use href="#sq" x="85.99" y="52.917" />
        <use href="#sq" x="119.06" y="13.229" />
        <use href="#sq" x="52.917" y="26.458" />
        <use href="#sq" x="72.76" y="26.458" />
        <use href="#sq" x="46.302" y="119.06" />
        <use href="#sq" x="79.375" y="119.06" />
        <use href="#sq" x="119.06" y="92.604"/>
        <use href="#sq" x="6.6146" y="92.604"/>
        <use x="59.531" href="#rect-hz"/>
        <use x="59.531" y="19.844" href="#rect-hz"/>
        <use x="79.375" y="105.83" href="#rect-hz"/>
        <use x="39.688" y="105.83" href="#rect-hz"/>
        <use x="59.531" y="33.073" href="#rect-hz"/>
        <use x="92.604" y="92.604" href="#rect-vt"/>
        <use x="72.76" y="105.83" href="#rect-vt"/>
        <use x="52.917" y="105.83" href="#rect-vt" />
        <use x="92.604" y="59.531" href="#rect-hz" />
        <rect x="105.83" y="52.917" width="6.6146" height="33.073"/>
        <rect x="19.844" y="52.917" width="6.6146" height="33.073" />
        <rect x="112.45" y="19.844" width="6.6146" height="33.073" />
        <rect x="13.229" y="19.844" width="6.6146" height="33.073" />
        <rect x="79.375" y="13.229" width="6.6146" height="92.604"/>
        <rect x="46.302" y="13.229" width="6.6146" height="92.604"/>
        <rect x="46.302" y="125.68" width="39.688" height="6.6146"/>
        <rect x="125.68" y="19.844" width="6.6146" height="85.99"/>
        <rect x="0" y="19.844" width="6.6146" height="85.99"/>
        <rect x="99.219" y="85.99" width="19.844" height="6.6146"/>
        <rect x="13.229" y="85.99" width="19.844" height="6.6146"/>
        <use href="#sq" transform="scale(-1,1)" x="-46.302" y="52.917"/>
        <use transform="scale(-1,1)" x="-39.687" y="92.604" href="#rect-vt"/>
        <use transform="scale(-1,1)" x="-39.687" y="59.531" href="#rect-hz"/>
      </g>
      <!-- Both wings -->
      <g fill=${randHsl()} transform="scale(-1)">
       <rect x="-125.68" y="-92.604" width="6.6146" height="72.76" />
       <rect x="-13.229" y="-92.604" width="6.6146" height="72.76" />
       <rect x="-119.06" y="-85.99" width="6.6146" height="33.073"/>
       <rect x="-19.844" y="-85.99" width="6.6146" height="33.073"/>
      </g>
      <!-- Ship body -->
      <g fill=${randHsl()}>
        <rect x="72.76" y="33.073" width="6.6146" height="72.76"/>
        <rect x="52.917" y="33.073" width="6.6146" height="72.76"/>
        <rect x="66.146" y="39.688" width="6.6146" height="79.375"/>
        <rect x="59.531" y="39.688" width="6.6146" height="79.375" />
        <use href="#sq" x="52.917" y="119.06"/>
        <use href="#sq" x="59.531" y="119.06"/>
        <use href="#sq" x="66.146" y="119.06"/>
        <use href="#sq" x="72.76" y="119.06"/>
      </g>
      <!-- Extension from body to the wings -->
      <g fill=${randHsl()}>
       <rect x="85.99" y="59.531" width="6.6146" height="46.302"/>
       <rect x="39.687" y="59.531" width="6.6146" height="46.302" />
       <rect x="99.219" y="66.146" width="6.6146" height="19.844"/>
       <rect x="26.458" y="66.146" width="6.6146" height="19.844"/>
       <rect x="92.604" y="66.146" width="6.6146" height="26.458"/>
       <rect x="33.073" y="66.146" width="6.6146" height="26.458"/>
      </g>
      <!-- Cockpit window -->
      <use x="59.531" y="26.458" href="#rect-hz" fill=${randHsl()}/>
      <!-- Cockpit -->
      <g fill=${randHsl()}>
       <use x="52.917" y="13.229" href="#rect-vt"/>
       <use x="59.531" y="6.6146" href="#rect-vt"/>
       <use x="66.146" y="6.6146" href="#rect-vt"/>
       <use x="72.76" y="13.229" href="#rect-vt"/>
      </g>
    </svg>
    `
);

const encodedStringsArr = rawStringsArr.map(
  (string) => `data:image/svg+xml;base64,${btoa(string)}`
);

export default encodedStringsArr;
