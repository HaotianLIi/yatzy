// yatzyEngine.js scoring rules and score table

class YatzyEngine {

  static UPPER = ["ones", "twos", "threes", "fours", "fives", "sixes"];
  static LOWER = ["onePair", "twoPairs", "threeKind", "fourKind",
                  "smallStraight", "largeStraight", "fullHouse", "chance", "yatzy"];
  static CATEGORIES = [...YatzyEngine.UPPER, ...YatzyEngine.LOWER];

  constructor() {
    this.scoreTable = {};
    for (const category of YatzyEngine.CATEGORIES) {
      this.scoreTable[category] = null;   // null = box not used yet
    }
  }

  // how many of each face, e.g. [4,4,4,6,6] -> {4: 3, 6: 2}
  countDice(diceValues) {
    const counts = {};
    for (const v of diceValues) {
      counts[v] = (counts[v] || 0) + 1;
    }
    return counts;
  }

  // faces that show up at least n times, highest first
  facesWithAtLeast(diceValues, n) {
    const counts = this.countDice(diceValues);
    return Object.keys(counts).map(Number).filter(face => counts[face] >= n).sort((a, b) => b - a);
  }

  // score for a box with these dice (0 if the dice don't fit)
  calculateScore(category, diceValues) {
    const sum = diceValues.reduce((total, v) => total + v, 0);
    const sorted = [...diceValues].sort((a, b) => a - b).join("");

    const upperIndex = YatzyEngine.UPPER.indexOf(category);
    if (upperIndex !== -1) {
      const face = upperIndex + 1;
      return diceValues.filter(v => v === face).length * face;
    }

    const pairs = this.facesWithAtLeast(diceValues, 2);
    switch (category) {
      case "onePair":       return pairs.length >= 1 ? pairs[0] * 2 : 0;
      case "twoPairs":      return pairs.length >= 2 ? (pairs[0] + pairs[1]) * 2 : 0;
      case "threeKind":     return (this.facesWithAtLeast(diceValues, 3)[0] || 0) * 3;
      case "fourKind":      return (this.facesWithAtLeast(diceValues, 4)[0] || 0) * 4;
      case "smallStraight": return sorted === "12345" ? 15 : 0;
      case "largeStraight": return sorted === "23456" ? 20 : 0;
      case "fullHouse":     return Object.values(this.countDice(diceValues)).sort().join("") === "23" ? sum : 0;
      case "chance":        return sum;
      case "yatzy":         return this.facesWithAtLeast(diceValues, 5).length ? 50 : 0;
    }
  }

  // saves the score, returns null if the box is already used
  recordScore(category, diceValues) {
    if (this.scoreTable[category] !== null) return null;
    this.scoreTable[category] = this.calculateScore(category, diceValues);
    return this.scoreTable[category];
  }

  getUpperSum() {
    return YatzyEngine.UPPER.reduce((total, c) => total + (this.scoreTable[c] || 0), 0);
  }

  // 50 points if the upper sum is 63 or more
  getBonus() {
    return this.getUpperSum() >= 63 ? 50 : 0;
  }

  getTotal() {
    const boxes = Object.values(this.scoreTable).reduce((total, s) => total + (s || 0), 0);
    return boxes + this.getBonus();
  }
}
