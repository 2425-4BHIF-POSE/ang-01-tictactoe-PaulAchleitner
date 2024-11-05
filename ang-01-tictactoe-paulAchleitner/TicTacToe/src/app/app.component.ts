import { Component, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FieldComponent } from "./components/field/field.component";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FieldComponent, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  // -1 = X
  // 1 = O
  protected readonly winner: WritableSignal<number> = signal(0);
  protected readonly grid: WritableSignal<number[][]> = signal([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]);

  protected readonly Turn: WritableSignal<number> = signal(-1);

  public SwapTurn() {
    this.Turn.update(turn => turn === -1 ? 1 : -1);
  }

  protected UpdateGrid(row: number, col: number) {
    if (this.winner() !== 0) return;
    this.grid.update(grid => {
      if (grid[row][col] === 0) {
        grid[row][col] = this.Turn();
        this.SwapTurn();
        this.winner.set(this.DetermineWinner(grid));
      }
      return grid;
    });
  }

  protected ResetGame() {
    this.winner.set(0);
    this.grid.update(grid => {
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          grid[row][col] = 0;
        }
      }
      return grid;
    });
  }

  private DetermineWinner(grid: number[][]): number {
    for (let row = 0; row < 3; row++) {
      if (grid[row][0] === grid[row][1] && grid[row][1] === grid[row][2]) {
        if (grid[row][0] === 1) return 1;
        if (grid[row][0] === -1) return -1;
      }
    }

    for (let col = 0; col < 3; col++) {
      if (grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col]) {
        if (grid[0][col] === 1) return 1;
        if (grid[0][col] === -1) return -1;
      }
    }

    // Check first diagonal
    if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
      if (grid[0][0] === 1) return 1; // Player O wins
      if (grid[0][0] === -1) return -1; // Player X wins
    }

    // Check second diagonal
    if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
      if (grid[0][2] === 1) return 1; // Player O wins
      if (grid[0][2] === -1) return -1; // Player X wins
    }

    // Check for a draw
    const isDraw = grid.every(row => row.every(cell => cell !== 0));
    if (isDraw) return 404;

    // No winner yet
    return 0;
  }
}
