class Infected extends Molecule{
  constructor({
    _i,
    px = 200,
    py = 200,
    vx = random(-2.5,2.5),
    vy = random(-2.5,2.5),
    r = random(obj.minMoleculeSize, obj.maxMoleculeSize)
  }){
    super({
      _i,
      px,
      py,
      vx,
      vy,
      r
    });
    this.color = color(232,86,63);
    this.dob = frameCount; //frameCount is a variable used to count the frameRate() of the sketch
    this.lifeLength = 1000; //Life length of 10 seconds
    
  }
}
