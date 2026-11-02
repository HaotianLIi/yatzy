class Dice {

  constructor(numberOfDice = 5) {
    this.numberOfDice = numberOfDice;
    this.values = new Array(numberOfDice).fill(1);    // current face of each die
    this.held = new Array(numberOfDice).fill(false);  // true = player is keeping this die
  }

  // random number from 1 to 6
  roll() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // rolls every die that is not held
  rollAll() {
    for (let i = 0; i < this.numberOfDice; i++) {
      if (!this.held[i]) {
        this.values[i] = this.roll();
      }
    }
    return this.getValues();
  }

  toggleHold(index) {
    this.held[index] = !this.held[index];
  }

  // un-keep all dice, used at the start of every turn
  reset() {
    this.held.fill(false);
  }

  getValues() {
    return [...this.values];
  }

  // dot positions for each face (same classes as dice.css)
  static positions(value) {
    const faces = {
      1: ["middle"],
      2: ["top-left", "bottom-right"],
      3: ["top-left", "middle", "bottom-right"],
      4: ["top-left", "top-right", "bottom-left", "bottom-right"],
      5: ["top-left", "top-right", "bottom-left", "bottom-right", "middle"],
      6: ["top-left", "top-right", "bottom-left", "bottom-right", "middle-left", "middle-right"]
    };
    return faces[value];
  }

  // returns the HTML for one die
  static showDie(value) {
    let dots = "";
    for (const pos of Dice.positions(value)) {
      dots += `<div class="${pos}"><div class="dot"></div></div>`;
    }
    return `<div class="dice">${dots}</div>`;
  }
}
