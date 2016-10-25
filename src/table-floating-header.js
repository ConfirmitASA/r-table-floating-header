import ReportalBase from "r-reporal-base";

var TableFloatingHeaderStyle = require('./table-floating-header-styles.css');

/**
 * FixedHeader class enables a fixed header appear on tables that have `.reportal-fixed-header` class when the table header is scrolled under address bar.
 */
class TableFloatingHeader {
  /**
   * @param {HTMLTableElement} source - source table that needs a cloned header
   * */
  constructor(source){
    if(typeof source == undefined || source.tagName != 'TABLE'){
      throw new TypeError('`source` must be defined and must be a table')
    }

    TableFloatingHeader.wrapTable(source);

    /**
     *  The cloned floating header without TBODY
     *  @type {HTMLTableElement}
     *  @memberOf TableFloatingHeader
     *  */
    this.header  = TableFloatingHeader.cloneHeader(source);

    /**
     *  The source table
     *  @type {HTMLTableElement}
     *  @memberOf TableFloatingHeader
     *  */
    this.source = source;
    /**
     *  Visibility status of the table
     *  @type {Boolean}
     *  @memberOf TableFloatingHeader
     *  */
    this.visible = false;

    this._meta = {
      lastScrollY:0,
      sourceTHEAD: source.querySelector('thead'),
      ticking:false
    };

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    this.resizeFixed();

    window.addEventListener("resize", ()=>this.resizeFixed.call(this), false); // attach a resize listener to resize the header
    window.addEventListener("scroll", ()=>this.scrollFixed.call(this), false); // attach a resize listener to resize the header
  }

  /**
   * calculates offset height of the table
   * @param {HTMLTableElement} source - source table
   * */
  static calcOffsetHeight(source){
    this._meta.tableOffsetTop = source.parentNode.offsetTop;
    this._meta.tableOffsetBottom = source.parentNode.offsetTop + source.offsetHeight - this._meta.sourceTHEAD.offsetHeight;
  }

  /**
   * Event reporting that a header is visible
   * @event TableFloatingHeader~reportal-fixed-header-visible
   */

  /**
   * Event reporting that a header is hidden
   * @event TableFloatingHeader~reportal-fixed-header-hidden
   */

  /**
   * sets visibility of the table
   * @param {HTMLTableElement} source - source table
   * @param {HTMLTableElement} header - cloned table with header only
   * @param {Boolean} visible - visibility status
   * @fires TableFloatingHeader~reportal-fixed-header-visible
   * @fires TableFloatingHeader~reportal-fixed-header-visible
   * */
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
   * wraps the `source` table into a `div.aggregatedTableContainer`
   * */
  static wrapTable(source){
    let wrapper = document.createElement('div');
    wrapper.classList.add('aggregatedTableContainer');
    source.parentNode.appendChild(wrapper);
    wrapper.appendChild(source);
  }

  /**
   * clones header of `source` table and appends to wrapper
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
   * function that polls the callback
   * @param {Function} callback - function that's going to be passed to `requestAnimationFrame` for execution
   * */
  requestTick(callback){
    if(!this._meta.ticking) {
      requestAnimationFrame(callback);
      this._meta.ticking = true;
    }
  }

  static _resizeCallback(){
    let initialHeader = this._meta.sourceTHEAD.querySelectorAll('tr>*'),
      clonedHeader = this.header.querySelectorAll('thead>tr>*'),
      headerWidth = this.source.offsetWidth + 'px',
      widths=[];
    // do reflow
    for(let i=0;i<initialHeader.length;i++){
      widths.push(initialHeader[i].offsetWidth);
    }
    //do repaint
    for(let c=0;c<clonedHeader.length;c++){
      clonedHeader[c].style.width = widths[c] + 'px';
    }
    this.header.style.width = headerWidth;

    TableFloatingHeader.calcOffsetHeight.call(this,this.source); //recalc height of the table after reflow
    this._meta.ticking=false;
    this.scrollFixed(); // to compensate top offset in case after resize the table is less in height and top has changed
  }

  /**
   * Calculates widths for all columns in the fixed header based on the `source`
   * */
  resizeFixed(){
    this.requestTick(TableFloatingHeader._resizeCallback.bind(this))
  }


  static _scrollCallback(){
    let offset = this._meta.lastScrollY,
      tableOffsetTop = this._meta.tableOffsetTop,
      tableOffsetBottom = this._meta.tableOffsetBottom;
    if((offset < tableOffsetTop || offset > tableOffsetBottom) && this.visible){
      this.visible = false;
      TableFloatingHeader.setVisibility(this.source,this.header,false);
    }
    else if(offset >= tableOffsetTop && offset <= tableOffsetBottom){
      this.header.style.top=offset-tableOffsetTop+'px';
      if(!this.visible){
        this.visible=true;
        TableFloatingHeader.setVisibility(this.source,this.header,true);
      }
    }
    this._meta.ticking=false;
  }


  /**
   * Displays a fixed header when the table header is scrolled off the screen
   * */
  scrollFixed() {
      this._meta.lastScrollY = window.pageYOffset;
      this.requestTick(TableFloatingHeader._scrollCallback.bind(this));
  }

}

export default TableFloatingHeader;


