function calculateLevel(points) {

  if (points >= 1000) {
    return { level: 5, title: "Cosmic Architect", nextLevel: null };
  }

  if (points >= 500) {
    return { level: 4, title: "Astral Traveler", nextLevel: 1000 };
  }

  if (points >= 200) {
    return { level: 3, title: "Oracle", nextLevel: 500 };
  }

  if (points >= 50) {
    return { level: 2, title: "Visionary", nextLevel: 200 };
  }

  return { level: 1, title: "Dreamer", nextLevel: 50 };
}

module.exports = calculateLevel;