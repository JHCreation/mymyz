import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import 'react-toastify/dist/ReactToastify.css';
import Aside from "./Aside"

export default function AdminWrapper ({children}) {

  return (
    <div className="w-full flex min-h-dvh">
      <Aside />
      <div className="w-full pt-nav ">
        {children}
      </div>
    </div>
  )
}