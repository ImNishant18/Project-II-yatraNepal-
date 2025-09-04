import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1]; // e.g. "users", "hotels"

  const [list, setList] = useState([]);
  const { data, loading, error } = useFetch(`/${path}`);

  useEffect(() => {
    if (Array.isArray(data)) {
      setList(data);
    } else if (data?.data && Array.isArray(data.data)) {
      setList(data.data);
    } else {
      setList([]);
    }
  }, [data]);

  const handleDelete = async (id) => {
    const entityName = path.endsWith("s") ? path.slice(0, -1) : path;
    if (!window.confirm(`Are you sure you want to delete this ${entityName}?`)) return;

    try {
      await axios.delete(`/${path}/${id}`, { withCredentials: true });
      setList((prev) => prev.filter((item) => item._id !== id));
      alert("Deleted successfully!");
    } catch (err) {
      alert("Failed to delete.");
      console.error(err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/${path}/${params.row._id}/edit`} style={{ textDecoration: "none" }}>
            <div className="viewButton">Edit</div>
          </Link>
          <div className="deleteButton" onClick={() => handleDelete(params.row._id)}>
            Delete
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data.</p>
      ) : (
        <DataGrid
          className="datagrid"
          rows={list}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      )}
    </div>
  );
};

export default Datatable;