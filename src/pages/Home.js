import React, { useState, useCallback } from 'react';
import ActorGrid from '../components/actor/ActorGrid';
import { RadioInputsWrapper, SearchButtonWrapper, SearchInput } from '../components/Home.styled';
import MainPageLayout from '../components/MainPageLayout';
import CustomRadio from '../components/show/CustomRadio';
import ShowGrid from '../components/show/ShowGrid';
import { apiGet } from '../misc/config';
import { useLastQuery, useWhyDidYouUpdate } from '../misc/custom-hooks';

const renderResults = (results) => {
  if (results && results.length === 0) {
    return <div>No results</div>
  }

  if (results && results.length > 0) {
    return results[0].show ? <ShowGrid data={results} /> : <ActorGrid data={results} />;
  }

  return null;
};

const Home = () => {
  const [input, setInput] = useLastQuery();
  const [results, setResults] = useState(null);
  const [searchOption, setSearchOption] = useState('shows');

  const isShowsSearch = searchOption === 'shows';

  const onSearch = () => {
    apiGet(`search/${searchOption}?q=${input}`).then(result => setResults(result));
  };

  const onInputChange = useCallback((ev) => {
    setInput(ev.target.value);
  }, [setInput]);

  const onKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      onSearch();
    }
  };

  const onRadioChange = useCallback((ev) => {
    setSearchOption(ev.target.value);
  }, []);

  useWhyDidYouUpdate('home', { onInputChange, onKeyDown });

  return (
    <MainPageLayout>
      <SearchInput
        type="text"
        placeholder='Search for something...'
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={input}
      />

      <RadioInputsWrapper>
        <div>
          <CustomRadio
            label="Shows"
            id="shows-search"
            value="shows"
            onChange={onRadioChange}
            checked={isShowsSearch}
          />
        </div>

        <div>
          <CustomRadio
            label="Actors"
            id="actors-search"
            value="people"
            onChange={onRadioChange}
            checked={!isShowsSearch}
          />
        </div>
      </RadioInputsWrapper>

      <SearchButtonWrapper>
        <button type="button" onClick={onSearch}>
          Search
        </button>
      </SearchButtonWrapper>

      {renderResults(results)}
    </MainPageLayout>
  )
}

export default Home;
