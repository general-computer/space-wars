function rand(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randHsl() {
  return `"hsl(${rand(359)} 100% ${rand(40) + 20}%)"`;
}

// Generate ship images with random color scheme
// the string is taken from src/img/spaceship-draft2-test.svg
export const rawStringsArr = new Array(69).fill("").map(
  () =>
    `<?xml version="1.0" encoding="UTF-8"?>
        <svg width="500" height="500" version="1.1" viewBox="0 0 132.29 132.29" xmlns="http://www.w3.org/2000/svg">
         <g fill="#7a7a7a" stroke-width="3">
          <rect x="66.146" width="6.6146" height="6.6146"/>
          <rect x="59.531" width="6.6146" height="6.6146"/>
          <rect x="52.917" y="6.6146" width="6.6146" height="6.6146"/>
          <rect x="72.76" y="6.6146" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="13.229" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="13.229" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="19.844" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="26.458" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="33.073" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="39.688" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="46.302" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="19.844" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="26.458" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="33.073" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="39.688" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="46.302" width="6.6146" height="6.6146"/>
          <rect x="6.6146" y="13.229" width="6.6146" height="6.6146"/>
          <rect x="1.8765e-6" y="19.844" width="6.6146" height="6.6146"/>
          <rect x="13.229" y="19.844" width="6.6146" height="6.6146"/>
          <rect x="1.8765e-6" y="26.458" width="6.6146" height="6.6146"/>
          <rect x="1.8765e-6" y="33.073" width="6.6146" height="6.6146"/>
          <rect x="13.229" y="26.458" width="6.6146" height="6.6146"/>
          <rect x="13.229" y="33.073" width="6.6146" height="6.6146"/>
          <rect x="13.229" y="39.688" width="6.6146" height="6.6146"/>
          <rect x="1.8765e-6" y="39.688" width="6.6146" height="6.6146"/>
          <rect x="1.8765e-6" y="46.302" width="6.6146" height="6.6146"/>
          <rect x="13.229" y="46.302" width="6.6146" height="6.6146"/>
          <rect x="19.844" y="52.917" width="6.6146" height="6.6146"/>
          <rect x="26.458" y="59.531" width="6.6146" height="6.6146"/>
          <rect x="39.688" y="52.917" width="6.6146" height="6.6146"/>
          <rect x="85.99" y="52.917" width="6.6146" height="6.6146"/>
          <rect x="92.604" y="59.531" width="6.6146" height="6.6146"/>
          <rect x="99.219" y="59.531" width="6.6146" height="6.6146"/>
          <rect x="33.073" y="59.531" width="6.6146" height="6.6146"/>
          <rect x="-6.1768e-8" y="52.917" width="6.6146" height="6.6146"/>
          <rect x="-6.1768e-8" y="59.531" width="6.6146" height="6.6146"/>
          <rect x="-6.1768e-8" y="66.146" width="6.6146" height="6.6146"/>
          <rect x="-6.1768e-8" y="72.76" width="6.6146" height="6.6146"/>
          <rect x="-6.1768e-8" y="79.375" width="6.6146" height="6.6146"/>
          <rect x="105.83" y="52.917" width="6.6146" height="6.6146"/>
          <rect x="112.45" y="46.302" width="6.6146" height="6.6146"/>
          <rect x="112.45" y="39.688" width="6.6146" height="6.6146"/>
          <rect x="112.45" y="33.073" width="6.6146" height="6.6146"/>
          <rect x="112.45" y="26.458" width="6.6146" height="6.6146"/>
          <rect x="112.45" y="19.844" width="6.6146" height="6.6146"/>
          <rect x="119.06" y="13.229" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="19.844" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="26.458" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="33.073" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="39.688" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="46.302" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="52.917" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="59.531" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="66.146" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="72.76" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="79.375" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="85.99" width="6.6146" height="6.6146"/>
          <rect x="52.917" y="26.458" width="6.6146" height="6.6146"/>
          <rect x="59.531" y="19.844" width="6.6146" height="6.6146"/>
          <rect x="66.146" y="19.844" width="6.6146" height="6.6146"/>
          <rect x="72.76" y="26.458" width="6.6146" height="6.6146"/>
          <rect x="19.844" y="85.99" width="6.6146" height="6.6146"/>
          <rect x="33.073" y="99.219" width="6.6146" height="6.6146"/>
          <rect x="39.688" y="105.83" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="105.83" width="6.6146" height="6.6146"/>
          <rect x="52.917" y="105.83" width="6.6146" height="6.6146"/>
          <rect x="72.76" y="105.83" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="105.83" width="6.6146" height="6.6146"/>
          <rect x="85.99" y="105.83" width="6.6146" height="6.6146"/>
          <rect x="92.604" y="99.219" width="6.6146" height="6.6146"/>
          <rect x="105.83" y="85.99" width="6.6146" height="6.6146"/>
          <rect x="52.917" y="112.45" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="119.06" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="119.06" width="6.6146" height="6.6146"/>
          <rect x="72.76" y="112.45" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="125.68" width="6.6146" height="6.6146"/>
          <rect x="52.917" y="125.68" width="6.6146" height="6.6146"/>
          <rect x="59.531" y="125.68" width="6.6146" height="6.6146"/>
          <rect x="66.146" y="125.68" width="6.6146" height="6.6146"/>
          <rect x="72.76" y="125.68" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="125.68" width="6.6146" height="6.6146"/>
          <rect x="-6.1768e-8" y="85.99" width="6.6146" height="6.6146"/>
          <rect x="-6.1768e-8" y="92.604" width="6.6146" height="6.6146"/>
          <rect x="112.45" y="85.99" width="6.6146" height="6.6146"/>
          <rect x="119.06" y="92.604" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="99.219" width="6.6146" height="6.6146"/>
          <rect x="92.604" y="92.604" width="6.6146" height="6.6146"/>
          <rect x="99.219" y="85.99" width="6.6146" height="6.6146"/>
          <rect x="33.073" y="92.604" width="6.6146" height="6.6146"/>
          <rect x="26.458" y="85.99" width="6.6146" height="6.6146"/>
          <rect x="66.146" y="33.073" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="52.917" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="66.146" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="72.76" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="79.375" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="85.99" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="92.604" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="99.219" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="52.917" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="66.146" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="72.76" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="79.375" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="85.99" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="92.604" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="99.219" width="6.6146" height="6.6146"/>
          <rect x="125.68" y="92.604" width="6.6146" height="6.6146"/>
          <rect x="105.83" y="59.531" width="6.6146" height="6.6146"/>
          <rect x="105.83" y="66.146" width="6.6146" height="6.6146"/>
          <rect x="105.83" y="72.76" width="6.6146" height="6.6146"/>
          <rect x="105.83" y="79.375" width="6.6146" height="6.6146"/>
          <rect x="19.844" y="59.531" width="6.6146" height="6.6146"/>
          <rect x="19.844" y="66.146" width="6.6146" height="6.6146"/>
          <rect x="19.844" y="72.76" width="6.6146" height="6.6146"/>
          <rect x="19.844" y="79.375" width="6.6146" height="6.6146"/>
          <rect x="1.3506e-5" y="99.219" width="6.6146" height="6.6146"/>
          <rect x="6.6146" y="92.604" width="6.6146" height="6.6146"/>
          <rect x="13.229" y="85.99" width="6.6146" height="6.6146"/>
          <rect x="59.531" y="33.073" width="6.6146" height="6.6146"/>
          <rect x="79.375" y="59.531" width="6.6146" height="6.6146"/>
          <rect x="46.302" y="59.531" width="6.6146" height="6.6146"/>
         </g>
         <g>
          <g fill=${randHsl()}>
           <rect x="6.6146" y="19.844" width="6.6146" height="6.6146"/>
           <rect x="6.6146" y="26.458" width="6.6146" height="6.6146"/>
           <rect x="6.6146" y="33.073" width="6.6146" height="6.6146"/>
           <rect x="6.6146" y="39.688" width="6.6146" height="6.6146"/>
           <rect x="6.6146" y="46.302" width="6.6146" height="6.6146"/>
           <rect x="6.6146" y="52.917" width="6.6146" height="6.6146"/>
           <rect x="13.229" y="52.917" width="6.6146" height="6.6146"/>
           <rect x="13.229" y="59.531" width="6.6146" height="6.6146"/>
           <rect x="13.229" y="66.146" width="6.6146" height="6.6146"/>
           <rect x="13.229" y="72.76" width="6.6146" height="6.6146"/>
           <rect x="6.6146" y="72.76" width="6.6146" height="6.6146"/>
           <rect x="6.6146" y="79.375" width="6.6146" height="6.6146"/>
           <rect x="13.229" y="79.375" width="6.6146" height="6.6146"/>
           <rect x="6.6146" y="85.99" width="6.6146" height="6.6146"/>
           <rect x="6.6146" y="59.531" width="6.6146" height="6.6146"/>
           <rect x="6.6146" y="66.146" width="6.6146" height="6.6146"/>
          </g>
          <g transform="translate(-46.302)" fill=${randHsl()}>
           <rect transform="scale(-1)" x="-171.98" y="-92.604" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-171.98" y="-85.99" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-171.98" y="-79.375" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-171.98" y="-72.76" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-171.98" y="-66.146" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-171.98" y="-59.531" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-165.36" y="-85.99" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-165.36" y="-79.375" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-165.36" y="-72.76" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-165.36" y="-66.146" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-171.98" y="-39.688" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-171.98" y="-33.073" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-165.36" y="-59.531" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-171.98" y="-26.458" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-171.98" y="-52.917" width="6.6146" height="6.6146"/>
           <rect transform="scale(-1)" x="-171.98" y="-46.302" width="6.6146" height="6.6146"/>
          </g>
          <g fill=${randHsl()} stroke-width="3">
           <rect x="26.458" y="66.146" width="6.6146" height="6.6146"/>
           <rect x="33.073" y="66.146" width="6.6146" height="6.6146"/>
           <rect x="39.687" y="66.146" width="6.6146" height="6.6146"/>
           <rect x="39.687" y="72.76" width="6.6146" height="6.6146"/>
           <rect x="39.687" y="59.531" width="6.6146" height="6.6146"/>
           <rect x="33.073" y="72.76" width="6.6146" height="6.6146"/>
           <rect x="26.458" y="72.76" width="6.6146" height="6.6146"/>
           <rect x="26.458" y="79.375" width="6.6146" height="6.6146"/>
           <rect x="33.073" y="79.375" width="6.6146" height="6.6146"/>
           <rect x="39.687" y="79.375" width="6.6146" height="6.6146"/>
           <rect x="39.687" y="85.99" width="6.6146" height="6.6146"/>
           <rect x="33.073" y="85.99" width="6.6146" height="6.6146"/>
           <rect x="39.687" y="92.604" width="6.6146" height="6.6146"/>
           <rect x="39.687" y="99.219" width="6.6146" height="6.6146"/>
          </g>
          <g fill=${randHsl()} stroke-width="3">
           <rect x="72.76" y="33.073" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="39.688" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="46.302" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="52.917" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="52.917" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="59.531" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="59.531" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="66.146" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="66.146" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="72.76" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="79.375" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="85.99" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="92.604" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="92.604" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="99.219" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="99.219" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="105.83" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="105.83" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="112.45" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="112.45" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="119.06" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="119.06" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="119.06" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="119.06" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="33.073" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="39.688" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="46.302" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="52.917" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="59.531" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="66.146" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="72.76" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="72.76" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="79.375" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="79.375" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="85.99" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="85.99" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="92.604" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="99.219" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="39.688" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="39.688" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="46.302" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="46.302" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="52.917" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="59.531" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="66.146" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="72.76" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="79.375" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="85.99" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="92.604" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="99.219" width="6.6146" height="6.6146"/>
          </g>
          <g fill="hsl(${rand(359)} 100% 40%)">
           <g fill="hsl(${rand(359)} 100% 40%)" stroke-width="3">
            <rect x="85.99" y="66.146" width="6.6146" height="6.6146"/>
            <rect x="85.99" y="59.531" width="6.6146" height="6.6146"/>
            <rect x="92.604" y="66.146" width="6.6146" height="6.6146"/>
            <rect x="99.219" y="66.146" width="6.6146" height="6.6146"/>
            <rect x="99.219" y="72.76" width="6.6146" height="6.6146"/>
            <rect x="92.604" y="72.76" width="6.6146" height="6.6146"/>
            <rect x="85.99" y="72.76" width="6.6146" height="6.6146"/>
            <rect x="85.99" y="79.375" width="6.6146" height="6.6146"/>
            <rect x="92.604" y="79.375" width="6.6146" height="6.6146"/>
            <rect x="99.219" y="79.375" width="6.6146" height="6.6146"/>
            <rect x="92.604" y="85.99" width="6.6146" height="6.6146"/>
            <rect x="85.99" y="85.99" width="6.6146" height="6.6146"/>
            <rect x="85.99" y="92.604" width="6.6146" height="6.6146"/>
            <rect x="85.99" y="99.219" width="6.6146" height="6.6146"/>
           </g>
          </g>
          <g fill=${randHsl()} stroke-width="3">
           <rect x="59.531" y="26.458" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="26.458" width="6.6146" height="6.6146"/>
          </g>
          <g fill=${randHsl()} stroke-width="3">
           <rect x="59.531" y="6.6146" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="6.6146" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="13.229" width="6.6146" height="6.6146"/>
           <rect x="66.146" y="13.229" width="6.6146" height="6.6146"/>
           <rect x="59.531" y="13.229" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="13.229" width="6.6146" height="6.6146"/>
           <rect x="52.917" y="19.844" width="6.6146" height="6.6146"/>
           <rect x="72.76" y="19.844" width="6.6146" height="6.6146"/>
          </g>
         </g>
        </svg>
        `
);

const encodedStringsArr = rawStringsArr.map(
  (string) => `data:image/svg+xml;base64,${btoa(string)}`
);

export default encodedStringsArr;
