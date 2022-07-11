import React from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import cash from "cash-dom";
import PrivateLayout from '@components/layout/privateLayout';
import Table from '@components/Table';
import ManageUser from './manage';
import { QUERY_ALL_PLAYER } from '@gql/player';

const columns = [
  { title: "Number", field: "backNumber", width: 100  },
  { title: "Name", field: "name" },
  { title: "Birth", field: "birth" },
  { title: "Position", field: "position" },
  { title: "Phone", field: "phone" },
]
const searchFieldName = ["email"]

const DefaultPage = () => {
  let navigate = useNavigate();

  const tableAction = (cell) => {
    const { row, action } = cell
    return (action == "edit") ? navigate(`/players/${row._nodeId}`) : cash("#delete-confirmation-modal").modal("show");
  }

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">
          {'Player data'} 
        </h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
          <Link to={'/players/create'} className="btn btn-primary shadow-md mr-2">Add New</Link>
        </div>
      </div>
      {/* <DeleteUser /> */}
      <Table query={QUERY_ALL_PLAYER}
        columns={columns}
        // option={{
        //   paginationSize: 2,
        //   paginationSizeSelector: [2, 100, 200, 300, 400, 500],
        // }}
        action={true}
        callback={tableAction}
        searchFieldName={searchFieldName}
      />
    </>
  )
}

const User = () => {

  return (
    <PrivateLayout>
      <Routes>
        <Route path=":id" element={<ManageUser />} />
        <Route path="/" element={<DefaultPage />} />
      </Routes>
    </PrivateLayout>
  )
}
export default User