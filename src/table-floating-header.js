import ReportalBase from "r-reporal-base";

var TableFloatingHeaderStyle = require('./table-floating-header-styles.css');
/**
 * FixedHeader class enables a fixed header appear on tables that have `.reportal-fixed-header` class when the table header is scrolled under address bar.
 */
class TableFloatingHeader {
  /**
   * @param {HTMLTableElement} source - source table that needs a cloned header
   * @param {Boolean} [visible=false] - if the header is visible on init
   * */
  constructor(source,visible=false){
    if(typeof source == undefined || source.tagName != 'TABLE'){
      throw new TypeError('`source` must be defined and must be a table')
    }

    TableFloatingHeader.wrapTable(source);
    let header = this.header = TableFloatingHeader.cloneHeader(source);
    this.visible=visible;
    TableFloatingHeader.resizeFixed(source, header);
    TableFloatingHeader.scrollFixed.call(this,source, header, this.visible);
    window.addEventListener("resize", ()=>TableFloatingHeader.resizeThrottler(source, header), false); // attach a resize listener to resize the header
    window.addEventListener("scroll", ()=>TableFloatingHeader.scrollFixed.call(this, source, header, this.visible), false); // attach a resize listener to resize the header
    //TableFloatingHeader.setVisibility(source, header, visible);
  }

  static setVisibility(source, header, visible){
    if(visible){
      header.style.display='table';
      source.dispatchEvent(ReportalBase.newEvent('reportal-fixed-header-visible'));
    } else {
      header.style.display='none';
      source.dispatchEvent(ReportalBase.newEvent('reportal-fixed-header-hidden'));
    }
  }

  /**
   * wraps a `this.source` table into a `div.aggregatedTableContainer`
   * */
  static wrapTable(source){
    let wrapper = document.createElement('div');
    wrapper.classList.add('aggregatedTableContainer');
    source.parentNode.appendChild(wrapper);
    wrapper.appendChild(source);
  }

  /**
   * clones header of `this.source` table and appends to `this.wrapper`
   * */
  static cloneHeader(source){
    let header = source.cloneNode(true);
    header.classList.add('fixed');
    source.parentNode.appendChild(header);
    [].slice.call(header.children).forEach(child=>{
      if(child.nodeName=='TBODY'){
        header.removeChild(child);
      }
    });
    return header;
  }

  /**
   * Calculates widths for all columns in the fixed header based on the `this.source`
   * */
  static resizeFixed(source,header){
    let initialHeader = source.parentNode.querySelectorAll(`table#${source.id}>thead>tr>*`);
    let clonedHeader = header.querySelectorAll('thead>tr>*');
    [].slice.call(clonedHeader).forEach((el,index) => {
      el.style.width=initialHeader[index].offsetWidth+'px';
    });
    header.style.width = source.offsetWidth+'px';
  }


  /**
   * Displays a fixed header when the table header is scrolled off the screen
   * */
  static scrollFixed(source, header) {
    let offset = window.pageYOffset,
      tableOffsetTop = source.parentNode.offsetTop,
      tableOffsetBottom = tableOffsetTop + source.offsetHeight - source.querySelector('thead').offsetHeight;
    if((offset < tableOffsetTop || offset > tableOffsetBottom) && this.visible){
      this.visible = false;
      TableFloatingHeader.setVisibility(source,header,false);
    }
    else if(offset >= tableOffsetTop && offset <= tableOffsetBottom){
      if(!this.visible){
        this.visible=true;
        TableFloatingHeader.setVisibility(source,header,true);
      }
      header.style.top=offset-tableOffsetTop+'px';
    }
  }

  /**
   * a debouncing function to make resize not so expensive, calls `resizeFixed` @ 15fps
   * */
  static resizeThrottler(source,header) {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    let resizeTimeout = setTimeout(()=>{
      resizeTimeout = null;
      TableFloatingHeader.resizeFixed(source,header);
      // The resizeFixed will execute at a rate of 15fps
    }, 66);
  }
}

export default TableFloatingHeader;


