# Conway's Game Of Life

Conway's Game of Life, made with [p5js](https://p5js.org/).

Available at: https://eduardomeloc.github.io/ConwayGameOfLife/

![screenshot](/img/sample.gif)

## How to use it?

- **Left Mouse Button**: Paint a cell
- **Right Mouse Button**: Erase a cell
- There is also a menu which allows you to **resize**/**randomize**/**clear** the grid, and **play**/**pause** the simulation.

## What is it?

From _Wikipedia_:

<blockquote>
The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:
<br/>
<ul>
<li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
<li>Any live cell with two or three live neighbours lives on to the next generation.</li>
<li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
<li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
</blockquote>

## Notes

- This was an educational project made for an university assignment.
- All of the code was included in a single file, ``main.js``.
- Most of the Conway's Game of Life logic is contained within the ``nextstep()`` function.
 