(function () {
  function theOtherMark(mark) {
    if (mark === "o") {
      mark = "x";
    } else {
      mark = "o";
    }
    return mark;
  }

  var nextMark = (function () {
    var mark = "o";
    return function nextMark() {
      mark = theOtherMark(mark);
      return mark;
    };
  })();

  var nextFrame;
  function setNextTurn(symbol) {
    if (nextFrame) {
      cancelAnimationFrame(nextFrame);
    }
    var progressbar = document.querySelector(".progress-bar__progress");
    progressbar.style.width = "0%";
    progressbar.dataset.turn = theOtherMark(symbol);

    const startTime = Date.now();

    function progressbarAnimation() {
      var timeElapsed = Date.now() - startTime;
      if (timeElapsed > 10000) {
        setNextTurn(nextMark());
      } else {
        progressbar.style.width = (timeElapsed / 100).toString().concat("%");
        nextFrame = requestAnimationFrame(progressbarAnimation);
      }
    }
    nextFrame = requestAnimationFrame(progressbarAnimation);
  }

  function coordinateSelector(row, column) {
    return '*[data-row="' + row + '"][data-column="' + column + '"]';
  }

  function cellIterator(rowStart, rowEnd, columnStart, columnEnd) {
    var currentRow = rowStart;
    var dRow = 1;
    var currentCol = columnStart;
    var dCol = 1;

    if (rowStart > rowEnd) {
      dRow = -1;
    } else if (rowStart === rowEnd) {
      dRow = 0;
    }

    if (columnStart > columnEnd) {
      dCol = -1;
    } else if (columnStart === columnEnd) {
      dCol = 0;
    }
    return {
      next: function () {
        if (currentRow !== rowEnd || currentCol !== columnEnd) {
          currentRow += dRow;
          currentCol += dCol;
          return {
            value: document.querySelector(
              coordinateSelector(currentRow, currentCol)
            ),
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      },
      [Symbol.iterator]: function () {
        return this;
      }
    };
  }

  function checkWin(symbol, cellIter) {
    var winning = 0;
    for (var cell of cellIter) {
      if (cell) {
        if (symbol === cell.innerHTML) {
          winning++;
        } else {
          winning = 0;
        }
        if (winning === 5) {
          return true;
        }
      }
    }
    return false;
  }

  function checkWinCondition(symbol, row, column) {
    if (
      checkWin(symbol, cellIterator(row, row, column - 5, column + 5)) ||
      checkWin(symbol, cellIterator(row - 5, row + 5, column, column)) ||
      checkWin(
        symbol,
        cellIterator(row - 5, row + 5, column - 5, column + 5)
      ) ||
      checkWin(symbol, cellIterator(row + 5, row - 5, column - 5, column + 5))
    ) {
      if ("x" === symbol) {
        alert("Player 1 won!");
      } else {
        alert("Player 2 won!");
      }
      return true;
    }
    return false;
  }

  function removeRestOfClickListeners() {
    var cells = document.querySelectorAll(".js-tictactoe-cell");
    for (var cell of cells) {
      cell.removeEventListener("click", markCell);
    }
  }

  function markCell(e) {
    var symbol = nextMark();
    e.target.dataset.mark = symbol;
    e.target.innerHTML = symbol;
    e.target.removeEventListener("click", markCell);
    setNextTurn(symbol);
    if (
      checkWinCondition(
        symbol,
        Number(e.target.dataset.row),
        Number(e.target.dataset.column)
      )
    ) {
      if (nextFrame) {
        cancelAnimationFrame(nextFrame);
      }
      removeRestOfClickListeners();
    }
  }

  function initSpacer() {
    var spacer = document.createElement("div");
    spacer.classList.add("col", "s1", "m1", "l3");
    return spacer;
  }

  function initCell(rownumber, columnnumber) {
    var cell = document.createElement("div");
    cell.classList.add("col", "s2", "m2", "l1");
    cell.classList.add("center-align");
    cell.classList.add("js-tictactoe-cell");
    cell.dataset.row = rownumber;
    cell.dataset.column = columnnumber;
    cell.addEventListener("click", markCell);
    return cell;
  }

  function initRow(rownumber) {
    var row = document.createElement("div");
    row.classList.add("row");
    row.append(
      initSpacer(),
      initCell(rownumber, 0),
      initCell(rownumber, 1),
      initCell(rownumber, 2),
      initCell(rownumber, 3),
      initCell(rownumber, 4)
    );
    return row;
  }

  function initializeBoard() {
    var board = document.querySelector(".board");
    board.append(initRow(0), initRow(1), initRow(2), initRow(3), initRow(4));
  }

  if (document.readyState !== "loading") {
    initializeBoard();
  } else {
    window.addEventListener("DOMContentLoaded", initializeBoard);
  }
})();
