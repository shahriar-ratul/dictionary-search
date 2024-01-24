import React, { Children, FC, RefObject, useState } from "react";
import "./App.css";
import { List } from "./components/List";
import { useDictionary } from "./hooks/useDictionary";

function App() {
  const dictionary = useDictionary();

  const [search, setSearch] = useState<string >('');
  

  const handleChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };


  return (
    <div className="app">
      <div className="header">
        <div>Render Virtualized</div>
      </div>

      <div className="content">
        <div className="search">
          <h4>
            <span role="img" aria-label="search">
              🔍
            </span>{" "}
            Search
           </h4>
          <input type="text" placeholder="Search..." value={search} onChange={handleChange} />
        </div>

        <List items={dictionary} search={search} />
      </div>
    </div>
  );
}

export default App;
