import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { withTranslation } from 'react-i18next';
import i18next from 'i18next';

const Searchbar = ({
  searchTerm,
  setSearchTerm,
  resetSearchTerm,
  searchLabel,
  t
}) => {
  const [searchValue, setSearchValue] = useState(searchTerm);

  const throttledSearchChange = useCallback(
    throttle((value) => {
      setSearchTerm(value.trim());
    }, 500),
    []
  );

  const handleResetSearch = () => {
    setSearchValue('');
    resetSearchTerm();
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
    throttledSearchChange(value.trim());
  };

  useEffect(() => {
    setSearchValue(searchTerm);
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder={searchLabel}
      />
      {searchValue && (
        <button onClick={handleResetSearch}>{t('Searchbar.Clear')}</button>
      )}
    </div>
  );
};

Searchbar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  resetSearchTerm: PropTypes.func.isRequired,
  searchLabel: PropTypes.string,
  t: PropTypes.func.isRequired
};

Searchbar.defaultProps = {
  searchLabel: i18next.t('Searchbar.SearchSketch')
};

export default withTranslation()(Searchbar);
