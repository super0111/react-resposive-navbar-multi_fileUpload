
import React, {useState, useEffect}  from "react";
import './style.css';
// import './style copy.scss';

const MAX_ITEMS = 10;
const BURGER_WIDTH = 43;

class Menu extends React.Component {
  constructor() {
    super();

    this.itemsWidth = null;
    this.visibleItemsWidth = 0;

    const visibleItems = [];
    for (let i = 1; i <= MAX_ITEMS; ++i) {
      visibleItems.push(`ITEM ${i}`);
    }

    this.state = {
      visibleItems,
      hiddenItems: [],
      aaa : false
    };
  }

  componentDidMount() {
    this.menu = document.querySelector(".middlePart");

    const { children: itemsElt } = this.menu;

    this.itemsWidth = [];
    for (let i = 0; i < itemsElt.length; ++i) {
      const { [i]: item } = itemsElt;
      const { marginLeft, marginRight } = window.getComputedStyle(item);
      const margin = parseFloat(marginLeft) + parseFloat(marginRight);
      const { offsetWidth: width } = item;
      this.itemsWidth.push(width + margin);
      this.visibleItemsWidth += width + margin;
    }

    window.addEventListener("resize", this.handleOnResize);
    this.handleOnResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleOnResize);
  }

  handleOnResize = () => {
    const { hiddenItems, visibleItems } = this.state;
    const { menu: {offsetWidth: menuWidth} } = this;
    
    console.log(`[handleOnResize] menuWidth: ${menuWidth} | visibleItemsWidth: ${this.visibleItemsWidth}`);

    if (this.visibleItemsWidth > menuWidth) {
      // Hide some menu items

      console.log(`[handleOnResize] too many items`);

      const newHiddenItems = [];
      const visibleItemsCopy = [...visibleItems];

      if (hiddenItems.length === 0) {
        this.visibleItemsWidth += BURGER_WIDTH;
      }

      let lastItemIndex = visibleItemsCopy.length;
      while (this.visibleItemsWidth > menuWidth) {
        lastItemIndex -= 1;
        const lastVisibleItem = visibleItemsCopy.pop();
        newHiddenItems.unshift(lastVisibleItem);
        this.visibleItemsWidth -= this.itemsWidth[lastItemIndex];
      }

      console.log(`[handleOnResize] new hidden items: ${newHiddenItems.length} | visible items: ${visibleItemsCopy.length}`);

      this.setState({
        hiddenItems: [...newHiddenItems, ...hiddenItems],
        visibleItems: [...visibleItemsCopy]
      });
    } else if (hiddenItems.length > 0) {
      // Show some menu items

      const hiddenItemsCopy = [...hiddenItems];
      let firstItemIndex = visibleItems.length;
      let potentialNewWidth =
        this.visibleItemsWidth +
        this.itemsWidth[firstItemIndex] -
        (hiddenItems.length === 1 ? BURGER_WIDTH : 0);

      const newVisibleItems = [];
      while (potentialNewWidth < menuWidth) {
        const firstHiddenItem = hiddenItemsCopy.shift();
        newVisibleItems.push(firstHiddenItem);
        this.visibleItemsWidth = potentialNewWidth;

        // Try one more item
        firstItemIndex += 1;
        potentialNewWidth +=
          this.itemsWidth[firstItemIndex] -
          (hiddenItemsCopy.length === 1 ? BURGER_WIDTH : 0);
      }

      if (newVisibleItems.length > 0) {
        console.log(`[handleOnResize] too few items`);
        console.log(`[handleOnResize] new visible items: ${newVisibleItems.length} | hidden items: ${hiddenItemsCopy.length}`);

        this.setState({
          hiddenItems: [...hiddenItemsCopy],
          visibleItems: [...visibleItems, ...newVisibleItems]
        });
      }
    }
  };

  onclick = () => {
      console.log('click')
    this.setState({
        aaa: !this.state.aaa,
      });
  }

  render() {
    const { hiddenItems, visibleItems, aaa } = this.state;

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
    
    const burgerIcon =
      hiddenItems.length > 0 ? (
        <div className="burgerIcon" onClick={() => this.onclick()}>
            { aaa?
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
            {aaa ?
                burgerMenu
                : null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Menu
