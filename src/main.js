/**
 * Created by IvanP on 07.09.2016.
 */

import TableFloatingHeader from "./table-floating-header";
import ReportalBase from "r-reportal-base";

window.Reportal = window.Reportal || {};
ReportalBase.mixin(window.Reportal,{
  TableFloatingHeader
});

export default TableFloatingHeader
