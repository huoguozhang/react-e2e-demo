import './MultiCheck.css';
import React, { useState, useEffect } from 'react';

export type Option = {
  label: string;
  value: string;
};

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. If columns > 1, the options should be placed from top to bottom in each column
 *
 * @param {string} label - the label text of this component
 * @param {Option[]} options - options
 * @param {string[]} values - default checked option values
 * @param {number} columns - default value is 1
 * @param {Function} onChange - when checked options are changed,
 *                             they should be passed to outside
 */
type Props = {
  label?: string;
  options: Option[];
  columns?: number;
  values?: string[];
  onChange?: (options: Option[]) => void;
};

export const CheckboxWrap: React.FunctionComponent<{
  wrapperClassName?: string;
}> = (props) => {
  return (
    <div className={props.wrapperClassName}>
      <label className="label">{props.children}</label>
    </div>
  );
};

const MultiCheck: React.FunctionComponent<Props> = (props): JSX.Element => {
  const { options, values, onChange, label } = props;
  let { columns = 1 } = props;
  // avoid negative number
  columns = Math.max(columns, 1);
  const isOverflow = options.length < columns;
  // The minimum number of item per column
  const columnItemMaxCount = isOverflow
    ? 1
    : Math.floor(options.length / columns);
  // The remaining items, one item is assigned to a column, starting at 0 and divided until it is finished
  const moreOneEndIndex = isOverflow ? 0 : options.length % columns;
  // helper array , render each column
  const splitColumnHelperArr = new Array(columns).fill(0);

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // follow values change
  useEffect(() => {
    if (values) setCheckedList(values.slice(0));
  }, [values]);

  // isAllSelected follow values and options change
  useEffect(() => {
    if (values?.length && values?.length === options.length) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [values, options]);

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const index = checkedList.indexOf(value);
    if (index > -1) {
      checkedList.splice(index, 1);
    } else {
      checkedList.push(value);
    }

    const selectedOptions = options.filter((v) =>
      checkedList.includes(v.value)
    );

    setCheckedList(selectedOptions.map((v) => v.value));

    setIsAllSelected(selectedOptions.length === options.length);

    if (onChange) onChange(selectedOptions);
  };

  const handleAllCheckboxChange = () => {
    const newIsAllSelected = !isAllSelected;
    if (newIsAllSelected) {
      setCheckedList(options.map((v) => v.value));
      if (onChange) onChange(options);
    } else {
      setCheckedList([]);
      if (onChange) onChange([]);
    }

    setIsAllSelected(newIsAllSelected);
  };

  const getIndexOffset = (i: number) => (i < moreOneEndIndex ? 1 : 0);

  let start = 0;
  let end = 0;

  const getStartIndex = (i: number) => {
    start = end;
    return start;
  };

  const getEndIndex = (i: number) => {
    end = start + columnItemMaxCount + getIndexOffset(i);
    return end;
  };

  return (
    <div className="MultiCheck">
      {label && (
        <div
          className="component-label"
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            background: '#01010188',
          }}
        >
          {label}
        </div>
      )}
      {options.length > 1 && (
        <CheckboxWrap wrapperClassName="select-all" key="all-checkbox">
          <input
            onChange={handleAllCheckboxChange}
            checked={isAllSelected}
            type="checkbox"
          />
          select all
        </CheckboxWrap>
      )}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {splitColumnHelperArr.map((v, index) => (
          <div
            className="column-wrapper"
            style={{
              marginRight: 8,
            }}
            key={index}
          >
            {options
              .slice(getStartIndex(index), getEndIndex(index))
              .map((v) => {
                const { value, label } = v;

                return (
                  <CheckboxWrap wrapperClassName="checkbox-wrapper" key={value}>
                    <input
                      checked={checkedList.includes(value)}
                      onChange={handleCheckChange}
                      value={value}
                      type="checkbox"
                    />
                    {label}
                  </CheckboxWrap>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiCheck;
