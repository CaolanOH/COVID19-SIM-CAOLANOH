// This is the Molecule Object and its attributes
class Molecule {
  constructor({
    _i,
    px = 200,
    py = 200,
    vx = random(-2.5,2.5),
    vy = random(-2.5,2.5),
    r = random(obj.minMoleculeSize, obj.maxMoleculeSize),
  }) {
    this.position = createVector(px, py);
    this.velocity = createVector(vx, vy);
    this.radius = r;
    this.color = color(0, 0, 0);

    this.index = _i;
  }

  // This function handles displaying the Molecule it RENDERS the Molecule on screen
  render() {
    noStroke()
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    fill(0);
    (obj.showText) ? (
      textSize(16),
      textAlign(CENTER),
      textFont("Open Sans"),
      text(this.index, this.position.x, this.position.y + 6)) : null;
  }

  //the function isIntersecting checks if two Molecules are intersecting
  //Take in Molecule as parameter. It measures the distance between two Molecules
  // if their gap is less than or equal to 0 they are overlapping so check is returned as true.
  isIntersecting(_molecule) {
    //console.log("Testing");

    let distance = dist(this.position.x, this.position.y, _molecule.position.x, _molecule.position.y);
    let gap = distance - this.radius - _molecule.radius;
    let check = (gap <= 0) ? true : false;

    let dx = this.position.x - _molecule.position.x;
    let dy = this.position.y - _molecule.position.y;
    //let dist = Math.sqrt(dx * dx + dy * dy);
    if (check) {
      let normalX = dx / distance;
      let normalY = dy / distance;



      let dVector = (this.velocity.x - _molecule.velocity.x) * normalX;
      dVector += (this.velocity.y - _molecule.velocity.y) * normalY;

      let dvx = dVector * normalX ;
      let dvy = dVector * normalY ;

      this.velocity.x -= dvx;
      this.velocity.y -= dvy;

      _molecule.velocity.x += dvx;
      _molecule.velocity.y += dvy;
    }
    return check;
  }

  dock(_otherMolecule) {
    //This is the ball we want to move (latest in Array)
    // let dockableBall = points[this.index];
    // This is where we want to dock it to
    let fixedBall = molecules[_otherMolecule.index];

    let resultantV = p5.Vector.sub(this.position, fixedBall.position)
    let rHeading = resultantV.heading();
    let rDist = (resultantV.mag() - this.radius - fixedBall.radius) / 2;

    // Here we thake away the calculated distance from the current position
    let moveX = cos(rHeading) * rDist;
    let moveY = sin(rHeading) * rDist;

    this.position.x -= moveX;
    this.position.y -= moveY;

    molecules[_otherMolecule.index].position.x += moveX;
    molecules[_otherMolecule.index].position.y += moveY;

    //console.log(molecules);
  }




  // Step controls the movement of the moleculess
  step() {

    (this.position.x > width - this.radius || this.position.x < 0 + this.radius) ?
    this.velocity.x *= -1: null;

    (this.position.y > height - this.radius- graphHeight || this.position.y < 0 + this.radius) ?
    this.velocity.y *= -1: null;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;


  }


}
