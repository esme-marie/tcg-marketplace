import type { NextComponentType, NextPageContext } from "next";
import styles from "../styles/SearchOptions.module.css";
import Image from "next/image";
import Dropdown from "../assets/images/Dropdown.svg";
import React, { useEffect, useState } from "react";

interface Props {
  placeHolder: string;
  options: any;
  isMulti: any;
  onChange: (value: string) => void;
  last: Boolean;
}

const SearchOptions: NextComponentType<NextPageContext, {}, Props> = ({
  placeHolder,
  options,
  isMulti,
  onChange,
  last,
}: Props) => {
  const [showMenu, setShowMenu] = useState<Boolean>(false);
  const [selectedValue, setSelectedValue] = useState<any>(isMulti ? [] : null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  let searchValue = "";

  useEffect(() => {
    const handler = (e: any) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });

  const handleInputClick = (e: any) => {
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (!selectedValue || selectedValue.length === 0) {
      return placeHolder;
    }

    if (isMulti) {
      return (
        <div className={styles.dropdown_tags}>
          {selectedValue.map((option: any) => (
            <div key={option.value}>
              {option.label}
            </div>
          ))}
        </div>
      );
    }
    return selectedValue.label;
  };

  const clearSelection = () => {
    return setSelectedValue(null);
  }

  const removeOption = (option: any) => {
    return selectedValue.filter((o: any) => o.value !== option.value);
  };

  const onItemClick = (option: any) => {
    let newValue;

    if (isMulti) {
      if (selectedValue.findIndex((o: any) => o.value === option.value) >= 0) {
        newValue = removeOption(option);
      } else {
        newValue = [...selectedValue, option];
      }
    } else {
      newValue = option;
    }

    setSelectedValue(newValue);
    onChange(newValue);
  };

  const isSelected = (option: any) => {
    if (!selectedValue) {
      return false;
    }

    return selectedValue.value === option.value;
  };

  const getOptions = () => {
    if (!searchValue) {
      return options;
    }

    return options.filter(
      (option: any) =>
        option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    );
  };

  return (
    <>
      <div className={`dropdown ${last && "dropdown_last"}`}>
        <div
          ref={inputRef}
          onClick={handleInputClick}
          className={styles.dropdown_input}
        >
          {!selectedValue ? (
            <div>{placeHolder}</div>
          ) : (
            <div
              className={`dropdown_value ${
                !selectedValue && "dropdown_selected_value"
              }`}
            >
              {getDisplay()}
            </div>
          )}

          <div className={styles.dropdown_tools}>
            <Image src={Dropdown} alt={"dropdown"} />
          </div>
        </div>
        {showMenu && (
          <div className={styles.dropdown_menu}>
            <div className={styles.clear} onClick={clearSelection}>Clear</div>
            {getOptions().map((option: any) => (
              <div
                onClick={() => onItemClick(option)}
                key={option.value}
                className={`dropdown_item ${isSelected(option) && "selected"}`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchOptions;
