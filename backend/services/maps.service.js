const Mechanic = require("../models/Mechanic");

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(origin, destination) {
  const earthRadiusKm = 6371;
  const lat1 = Number(origin.latitude);
  const lon1 = Number(origin.longitude);
  const lat2 = Number(destination.latitude);
  const lon2 = Number(destination.longitude);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  return Number((earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
}

function estimateEtaMinutes(distanceKm) {
  const citySpeedKmPerHour = 28;
  return Math.max(6, Math.round((Number(distanceKm || 1) / citySpeedKmPerHour) * 60));
}

function estimatePrice({ issueType, vehicleType, distanceKm }) {
  const issueBase = {
    "Flat tyre": 899,
    "Battery jumpstart": 799,
    "Engine overheating": 1499,
    "Fuel delivery": 999,
    "Towing support": 2499,
    "General diagnosis": 699
  };
  const vehicleMultiplier = {
    Bike: 0.8,
    Car: 1,
    SUV: 1.15,
    Truck: 1.5
  };

  const base = issueBase[issueType] || 999;
  const multiplier = vehicleMultiplier[vehicleType] || 1;
  const distanceCharge = Math.round(Math.max(0, Number(distanceKm || 0) - 3) * 45);

  return Math.round((base + distanceCharge) * multiplier);
}

async function findNearbyMechanics(location, options = {}) {
  const maxDistanceKm = options.maxDistanceKm || 15;
  const limit = options.limit || 10;

  const mechanics = await Mechanic.find({
    isAvailable: true,
    availabilityStatus: "online",
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [Number(location.longitude), Number(location.latitude)]
        },
        $maxDistance: maxDistanceKm * 1000
      }
    }
  }).limit(limit);

  return mechanics
    .map((mechanic) => {
      const distanceKm = calculateDistanceKm(location, {
        latitude: mechanic.location.coordinates[1],
        longitude: mechanic.location.coordinates[0]
      });

      return {
        mechanic,
        distanceKm,
        etaMinutes: estimateEtaMinutes(distanceKm)
      };
    })
    .filter((entry) => entry.distanceKm <= (entry.mechanic.serviceRadiusKm || maxDistanceKm))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

module.exports = {
  calculateDistanceKm,
  estimateEtaMinutes,
  estimatePrice,
  findNearbyMechanics
};
