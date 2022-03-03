import React, {useState, useEffect, useRef, useCallback}  from "react";
import './style.css';

const MAX_ITEMS = 10;
const BURGER_WIDTH = 42;

export default function Menu() {

    const initvisibleItems = [];
    for (let i = 1; i <= MAX_ITEMS; ++i) {
        initvisibleItems.push(`ITEM ${i}`);
    }

    let itemsWidth = null;
    let visibleItemsWidth = 0;
    const [ visibleItems, setVisibleItems] = useState(initvisibleItems);
    const [ hiddenItems, setHiddenItems] = useState([]);
    const [ isShowMore, setIsShowMore ] = useState(false);
    const menu = useRef()
    


    const handleOnResize = useCallback(() => {
      const {offsetWidth: menuWidth} = menu.current;

      if (visibleItemsWidth > menuWidth) {
        // Hide some menu items

        const newHiddenItems = [];
        const visibleItemsCopy = [...visibleItems];


        if (hiddenItems.length === 0) {
          visibleItemsWidth += BURGER_WIDTH;
        }

        let lastItemIndex = visibleItemsCopy.length;
        while (visibleItemsWidth > menuWidth) {
          lastItemIndex -= 1;
          const lastVisibleItem = visibleItemsCopy.pop();
          newHiddenItems.unshift(lastVisibleItem);
          visibleItemsWidth -= itemsWidth[lastItemIndex];
        }

        setHiddenItems([...newHiddenItems, ...hiddenItems]);
        setVisibleItems([...visibleItemsCopy]);
      } else if (hiddenItems.length > 0) {
        // Show some menu items

        const hiddenItemsCopy = [...hiddenItems];


        let firstItemIndex = visibleItems.length;
        let potentialNewWidth =
          visibleItemsWidth +
          itemsWidth[firstItemIndex] -
          (hiddenItems.length === 1 ? BURGER_WIDTH : 0);

        const newVisibleItems = [];
        while (potentialNewWidth < menuWidth) {
          const firstHiddenItem = hiddenItemsCopy.shift();

          newVisibleItems.push(firstHiddenItem);
          visibleItemsWidth = potentialNewWidth;

          // Try one more item
          firstItemIndex += 1;
          potentialNewWidth +=
            itemsWidth[firstItemIndex] -
            (hiddenItemsCopy.length === 1 ? BURGER_WIDTH : 0);
        }

        if (newVisibleItems.length > 0) {
          setHiddenItems([...hiddenItemsCopy]);
          setVisibleItems([...visibleItems, ...newVisibleItems]);
        }
      }
    }, [visibleItems, hiddenItems])

    useEffect(() => {
      // Update the document title using the browser API

        menu.current = document.querySelector(".middlePart");
        const { children: itemsElt } = menu.current;

        itemsWidth = [];
        for (let i = 0; i < itemsElt.length; ++i) {
        const { [i]: item } = itemsElt;
        const { marginLeft, marginRight } = window.getComputedStyle(item);
        const margin = parseFloat(marginLeft) + parseFloat(marginRight);
        const { offsetWidth: width } = item;
        itemsWidth.push(width + margin);
        visibleItemsWidth += width + margin;
        }

        window.addEventListener("resize", handleOnResize);

        return () => {
            window.removeEventListener("resize", handleOnResize);
        }
    }, [handleOnResize]);

    const visItems = visibleItems.map(i => (
      <div className="item" key={i}>
        {i}
      </div>
    ));

    const hidItems = hiddenItems.map(i => (
      <div className="item" key={i}>
        {i}
      </div>
    ));

    console.log("hidItems", hidItems)

    const onClick = () => {
        setIsShowMore(!isShowMore)
    }

    const burgerIcon =
      hiddenItems.length > 0 ? (
        <div className="burgerIcon" onClick={onClick}>
            { isShowMore?
                <div className="aaa">
                    <div className="more-text">Less</div>
                    <div className="more-icon"><i className="fas fa-angle-up"></i></div> 
                </div>
                : 
                <div className="aaa">
                    <div className="more-text">More</div>
                    <div className="more-icon"> <i className="fas fa-angle-down"></i></div>
                </div>
            }
        </div>
      ) : null;
    const burgerMenu =
      hiddenItems.length > 0 ? (
        <div className="burgerMenu">
          <div className="items">{hidItems}</div>
        </div>
      ) : null;

    console.log("hidden", hiddenItems)

    return (
      <div className="root">
        <div className="navbar">
          <div className="middlePart">
            {visItems}
            {burgerIcon}
            {isShowMore ?
                burgerMenu
                : null
            }
          </div>
        </div>
      </div>
    );
}