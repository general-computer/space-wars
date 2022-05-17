// Calculating if a ship is in the dead zone
function isDying(x, y, mapLength, zoneLength) {
  const deadZoneWidth = (mapLength - zoneLength) / 2;
  const liveZoneBoundary = {
    lower: deadZoneWidth,
    upper: mapLength - deadZoneWidth,
  };
  if (
    x < liveZoneBoundary.lower ||
    x > liveZoneBoundary.upper ||
    y < liveZoneBoundary.lower ||
    y > liveZoneBoundary.upper
  )
    return true;
  else return false;
}

export { isDying };
