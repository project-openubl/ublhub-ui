import React, { useState } from "react";
import { ContextSelector, ContextSelectorItem } from "@patternfly/react-core";

const filterItems = (items: string[], filterText: string) => {
  const filtered =
    filterText === ""
      ? [...items]
      : items.filter(
          (f) => f.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
        );

  return filtered;
};

export interface SimpleContextSelectorProps {
  value?: string;
  items: string[];
  onChange: (value: string) => void;
}

export const SimpleContextSelector: React.FC<SimpleContextSelectorProps> = ({
  value,
  items,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleOnSelect = (_: any, value: any) => {
    const selectedItem = items.find((f) => f === value);
    setIsOpen((current) => !current);
    if (selectedItem) {
      onChange(selectedItem);
    }
  };

  const handleOnToggle = (_: any, isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const handleOnSearchInputChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <ContextSelector
      toggleText={value}
      onSearchInputChange={handleOnSearchInputChange}
      isOpen={isOpen}
      searchInputValue={searchValue}
      onToggle={handleOnToggle}
      onSelect={handleOnSelect}
      screenReaderLabel="Selected item:"
    >
      {filterItems(items, searchValue).map((item, index) => (
        <ContextSelectorItem key={index}>{item}</ContextSelectorItem>
      ))}
    </ContextSelector>
  );
};
