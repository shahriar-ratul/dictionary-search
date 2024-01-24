import styled from "@emotion/styled";
import React, { FC, useEffect, useState } from "react";
import { Item } from "./Item";
import { SafelyRenderChildren } from "./SafelyRenderChildren";

const ScrollWrapper = styled.div`
  border: 1px solid black;
  width: 100%;
  height: 500px;
  overflow: auto;
`;

const ListWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

export interface ListProps {
  items: string[];
  search: string | null;
}

export const List: FC<ListProps> = ({ items, search, children }) => {
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [totalItemsLoaded, setTotalItemsLoaded] = useState(0);

  useEffect(() => {
    // Reset visible items when the items prop or search changes
    setStartIndex(0);
    setTotalItemsLoaded(0);

    const filterAndLoadItems = () => {
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );
      const newFilteredItems = filtered.slice(0, 200);
      setFilteredItems(newFilteredItems);
      setTotalItemsLoaded(newFilteredItems.length);
    };

    filterAndLoadItems();
  }, [items, search]);


  console.log('filteredItems', filteredItems.length);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } =
      event.target as HTMLDivElement;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;

    // Load more items when scrolling down
    if (scrollBottom < 50 && totalItemsLoaded < 2000) {
      const newStartIndex = startIndex + 200;
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );
      const newVisibleItems = filtered.slice(
        newStartIndex,
        newStartIndex + 200
      );
      setStartIndex(newStartIndex);
      setTotalItemsLoaded(totalItemsLoaded + newVisibleItems.length);

      const newFilteredItems = filtered.slice(0, totalItemsLoaded);
      setFilteredItems((prevVisibleItems) => [
        ...newFilteredItems,
        ...newVisibleItems,
      ]);
    }

    // if totalItemsLoaded > 2000, then we need to remove items from the top

    if (scrollBottom < 50 && totalItemsLoaded >= 2000) {
      console.log("totalItemsLoaded", totalItemsLoaded);

      const itemsToRemove = 1000;

      setTotalItemsLoaded(totalItemsLoaded - itemsToRemove);
      // then we need to add items to the bottom
      const newStartIndex = startIndex + 200;
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );
      setStartIndex(newStartIndex);
      const newFilteredItems = filtered.slice(itemsToRemove, totalItemsLoaded);

      setFilteredItems((prevVisibleItems) => [
        ...prevVisibleItems,
        ...newFilteredItems,
      ]);
    }


    // Handle scrolling up
    if (scrollTop < 50 && startIndex > 0 && totalItemsLoaded < 2000) {
      console.log("scrollTop", scrollTop);
      console.log("startIndex", startIndex);
      console.log("totalItemsLoaded", totalItemsLoaded);

      // then we need to add items to the top
      const newStartIndex = Math.max(0, startIndex - 200);
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );
      const newVisibleItems = filtered.slice(
        newStartIndex,
        newStartIndex + 200
      );
      setStartIndex(newStartIndex);

      const newFilteredItems = filtered.slice(0, totalItemsLoaded);

      setFilteredItems((prevVisibleItems) => [
        ...newVisibleItems,
        ...prevVisibleItems,
      ]);
    }

    // if totalItemsLoaded > 2000, then we need to remove items from the bottom

    if (scrollTop < 50 && startIndex > 0 && totalItemsLoaded >= 2000) {
      
      console.log("scrollTop", scrollTop);
      console.log("totalItemsLoaded", totalItemsLoaded);
    
      // then we need to add items to the top
      const newStartIndex = Math.max(0, startIndex - 200);
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );
      const newVisibleItems = filtered.slice(
        newStartIndex,
        newStartIndex + 200
      );
      setStartIndex(newStartIndex);

      const newPrevVisibleItems = filtered.slice(
        totalItemsLoaded - 1000,
        totalItemsLoaded
      );

      setFilteredItems((prevVisibleItems) => [
        ...newVisibleItems,
        ...newPrevVisibleItems,
      ]);

    }

  };

  return (
    <ScrollWrapper onScroll={handleScroll}>
      <ListWrapper>
        <SafelyRenderChildren>
          {filteredItems.map((word, index) => (
            <Item key={index}>{word}</Item>
          ))}
        </SafelyRenderChildren>
      </ListWrapper>
    </ScrollWrapper>
  );
};
