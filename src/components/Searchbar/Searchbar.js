import { useState } from 'react';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';

const Searchbar = ({ onSubmit }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (searchValue.trim() === '') {
      toast.error(`Field is empty!`);

      return;
    }

    onSubmit(searchValue);
    setSearchValue('');
  };

  const changeSearchValue = ({ currentTarget: { value } }) => {
    setSearchValue(value.toLowerCase());
  };

  return (
    <header className="Searchbar">
      <Toaster position="top-center" reverseOrder={false} />

      <form className="SearchForm" onSubmit={handleSubmit}>
        <button type="Submit" className="SearchForm-button">
          <span className="SearchForm-button-label">Search</span>
        </button>

        <input
          onChange={changeSearchValue}
          value={searchValue}
          name="searchValue"
          className="SearchForm-input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

export default Searchbar;

Searchbar.propTypes = {
  onSubmit: PropTypes.func,
};
