import TableFloatingHeader from '../table-floating-header';

describe('TableFloatingHeader', () => {
  beforeEach(()=>{
    jasmine.getFixtures().fixturesPath = 'base/src/__tests__/fixtures';
    loadFixtures('table-nested-headers.html','table-crazy-nested-headers.html','table-nested-rowheaders.html');
  });

  it('wrapTable should create a wrapper', () => {
    const table = document.querySelector('#table-nested-headers');
    const parent = table.parentNode;
    Reportal.TableFloatingHeader.wrapTable(table);
    expect(table.parentNode).not.toEqual(parent);
    expect(table.parentNode.parentElement).toEqual(parent);
    expect(table.parentNode).toBeMatchedBy('.aggregatedTableContainer');
  });

  it('cloneHeader should create a similar table without tbody', () => {
    const table = document.querySelector('#table-nested-headers');
    Reportal.TableFloatingHeader.wrapTable(table);
    let header = Reportal.TableFloatingHeader.cloneHeader(table);
    const parent = table.parentNode;
    expect(header).toExist();
    expect(header.parentNode).toEqual(parent);
    expect(header.id).toEqual(table.id);
    expect(header.querySelector('tbody')).toBeNull();
  });

  it('constructor must return an object with header and visible property', () => {
    const table = document.querySelector('#table-nested-headers');
    let tfh = new Reportal.TableFloatingHeader(table);
    expect(typeof tfh).toEqual('object');
    expect(tfh.hasOwnProperty('visible')).toBeTruthy();
    expect(tfh.hasOwnProperty('header')).toBeTruthy();
    expect(tfh.header.nodeName).toEqual('TABLE');
  });
  it('constructor must throw when no table is passed or element is not a table', () => {
   expect(()=>{let tfh = new Reportal.TableFloatingHeader()}).toThrowError(TypeError);
   let el = document.createElement('span');
    document.querySelector('#jasmine-fixtures').appendChild(el);
   expect(()=>{let tfh = new Reportal.TableFloatingHeader(el)}).toThrowError(TypeError);
  });

  it('setVisibility should make table visible/invisible and trigger events', () => {
    const table = document.querySelector('#table-nested-headers');
    Reportal.TableFloatingHeader.wrapTable(table);
    let header = Reportal.TableFloatingHeader.cloneHeader(table);
    let spyEventVisible = spyOnEvent('#table-nested-headers', 'reportal-fixed-header-visible');
    let spyEventHidden = spyOnEvent('#table-nested-headers', 'reportal-fixed-header-hidden');
    Reportal.TableFloatingHeader.setVisibility(table, header, false);
    expect(spyEventHidden).toHaveBeenTriggered();
    expect(spyEventVisible).not.toHaveBeenTriggered();
    expect(header.style.display).toEqual('none');
    Reportal.TableFloatingHeader.setVisibility(table, header, true);
    expect(spyEventVisible).toHaveBeenTriggered();
    expect(header.style.display).toEqual('table');
  });

});
