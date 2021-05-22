import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import * as icons from './icons';
import Header from './components/Header';
import IconWrapper from './components/IconWrapper';
import Popover from './components/Popover';
import Footer from './components/Footer';
import CustomizationBar from './components/CustomizationBar';
import SearchResults from './components/SearchResults';
import theme from './theme';

import upperCamelCase from 'uppercamelcase';
import Fuse from 'fuse.js';
import data from './data.json';

const Container = styled.div`
  display: grid;
  grid-gap: 8px;
  margin: 0;
  padding: 16px;
  @media (min-width: 768px) {
    grid-gap: 12px;
    padding: 12px 24px 24px;
  }
`

const NoResults = styled.span`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4em 0;
  color: #1B1C32;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  code {
    margin-left: 2px;
    border-bottom: 1px dotted #1B1C32;
  }
`

const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0;
`

const SecondaryLinks = styled.a`
  transition: all 150ms ease-out;
  display: flex;
  align-items: center;
  background: #f5f7f9;
  color: #1B1C32;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  &:hover {
    background: #C9D5D9;
  }
  svg {
    margin-right: 4px;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(0, 95, 204, 0.3);
  }
`

const DATA = Object.values(data).map(x => [x])
const ICON_KEYS = Object.keys(icons)

const fuse = new Fuse(DATA.flat(), {
  keys: [
    'name',
    {
      name: 'description',
      weight: 0.1,
    },
  ],
  includeScore: true,
  threshold: 0.2,
})

const App = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState();
  const [query, updateQuery] = useState('');
  const [stroke, setStroke] = useState(2);
  const [size, setSize] = useState(24);
  const [height, setHeight] = useState(0);

  const fuseResults = fuse.search(query);
  const results = query ? fuseResults.map(search => upperCamelCase(search.item.name)) : ICON_KEYS;

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header
          icons={icons}
          setHeight={setHeight}
        />
        <Container>
          <CustomizationBar
            height={height}
            query={query}
            updateQuery={updateQuery}
            icons={icons}
            stroke={stroke}
            setStroke={setStroke}
            size={size}
            setSize={setSize}
          />
          <SearchResults>
            {results.length === 0 && (
              <NoResults>
                <span style={{ fontSize: "6em", color: "#DAE4E8" }}>( · _ · )</span>
                <span style={{ margin: "2em 0 1em 0" }}>There are no icons for <code>{query}</code></span>
                <SecondaryLinks href="https://github.com/artcoholic/akar-icons/issues" target="_blank"><icons.File size={14} />Request an icon</SecondaryLinks>
              </NoResults>
            )}
            {results.map((key, index) => {
              const Icon = icons[key];

              return (
                <IconWrapper key={index} icon={key} setOpen={setOpen} setName={setName}>
                  <IconContainer>
                    <Icon strokeWidth={stroke} size={size} />
                  </IconContainer>
                </IconWrapper>
              )
            })}
          </SearchResults>
        </Container>
        <Popover open={open} setOpen={setOpen} name={name} icons={icons} size={size} />
        <Footer icons={icons} />
      </ThemeProvider>
    </>
  )
}

export default App;