class Vaccinator extends Molecule {
  constructor({
    _i,
    px = 200,
    py = 200,
    vx = random(-2.5,2.5),
    vy = random(-2.5,2.5),
    r = random(obj.minMoleculeSize, obj.maxMoleculeSize)
  }) {
    super({
      _i,
      px,
      py,
      vx,
      vy,
      r
    });
    this.color = color(252,225,82);
    this.intersectColor = color(100,0,0);
  }
}
