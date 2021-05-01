import React from "react";

export interface ColSelection<T> {
  row: T;
  colIndex: number;
}

export interface IColSelectionStateArgs<T> {
  rows: T[];
  initialSelected?: ColSelection<T>[];
  isEqual?: (a: T, b: T) => boolean;
  externalState?: [
    ColSelection<T>[],
    React.Dispatch<React.SetStateAction<ColSelection<T>[]>>
  ];
}

export interface IColSelectionState<T> {
  selectedCols: ColSelection<T>[];
  isColSelected: (row: T, colIndex: number) => boolean;
  toggleSelectedCol: (row: T, colIndex: number, isSelecting?: boolean) => void;
  toggleSelectedColSingle: (
    rows: T,
    colIndex: number,
    isSelecting?: boolean
  ) => void;
  setSelectedCols: (cols: ColSelection<T>[]) => void;
}

export const useColSelectionState = <T,>({
  rows,
  initialSelected = [],
  isEqual = (a, b) => a === b,
  externalState,
}: IColSelectionStateArgs<T>): IColSelectionState<T> => {
  const internalState = React.useState<ColSelection<T>[]>(initialSelected);
  const [selectedCols, setSelectedCols] = externalState || internalState;

  const isColSelected = (row: T, colIndex: number) => {
    return selectedCols.some(
      (i) => isEqual(i.row, row) && i.colIndex === colIndex
    );
  };

  const toggleColSelected = (
    row: T,
    colIndex: number,
    isSelecting = !isColSelected(row, colIndex)
  ) => {
    if (isSelecting) {
      setSelectedCols([...selectedCols, { colIndex, row }]);
    } else {
      setSelectedCols(
        selectedCols.filter(
          (i) => !(isEqual(i.row, row) && i.colIndex === colIndex)
        )
      );
    }
  };

  const toggleSelectedColSingle = (
    row: T,
    colIndex: number,
    isSelecting = !isColSelected(row, colIndex)
  ) => {
    const otherSelectedCols = selectedCols.filter(
      (selected) => !isEqual(selected.row, row)
    );

    if (isSelecting) {
      setSelectedCols([...otherSelectedCols, { row, colIndex }]);
    } else {
      setSelectedCols(otherSelectedCols);
    }
  };

  return {
    selectedCols,
    isColSelected: isColSelected,
    toggleSelectedCol: toggleColSelected,
    toggleSelectedColSingle: toggleSelectedColSingle,
    setSelectedCols: setSelectedCols,
  };
};
